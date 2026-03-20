import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private twilioClient: any;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const accountSid = this.config.get('TWILIO_ACCOUNT_SID');
    const authToken = this.config.get('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(accountSid, authToken);
      } catch (e) {
        this.logger.warn('Twilio non initialisé: ' + e.message);
      }
    }
  }

  async envoyerMessage(to: string, body: string): Promise<boolean> {
    const from = this.config.get('TWILIO_WHATSAPP_FROM') || 'whatsapp:+14155238886';

    // Sauvegarder message sortant
    await this.prisma.message.create({
      data: {
        de: from,
        vers: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
        contenu: body,
        direction: 'SORTANT',
      },
    });

    if (!this.twilioClient) {
      this.logger.log(`[SIMULATION] WhatsApp vers ${to}: ${body}`);
      return true;
    }

    try {
      await this.twilioClient.messages.create({
        from: from.startsWith('whatsapp:') ? from : `whatsapp:${from}`,
        to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
        body,
      });
      this.logger.log(`Message WhatsApp envoyé à ${to}`);
      return true;
    } catch (e) {
      this.logger.error(`Erreur envoi WhatsApp: ${e.message}`);
      return false;
    }
  }

  async envoyerInstructionEquipe(equipe: string, message: string): Promise<boolean> {
    const config = await this.prisma.configEquipe.findUnique({
      where: { equipe: equipe as any },
    });

    if (!config) {
      this.logger.warn(`Config équipe ${equipe} introuvable`);
      return false;
    }

    const texte = `📋 INSTRUCTIONS ChantierOps\nÉquipe ${equipe}:\n\n${message}\n\n_ChantierOps Luxembourg_`;
    return this.envoyerMessage(config.numeroWhatsApp, texte);
  }

  async traiterMessageEntrant(data: {
    From: string;
    Body: string;
    To: string;
  }) {
    const { From, Body } = data;
    this.logger.log(`Message reçu de ${From}: ${Body}`);

    // Identifier l'équipe par numéro
    const config = await this.prisma.configEquipe.findFirst({
      where: { numeroWhatsApp: From.replace('whatsapp:', '') },
    });

    // Sauvegarder message entrant
    await this.prisma.message.create({
      data: {
        de: From,
        vers: data.To,
        contenu: Body,
        equipe: config?.equipe,
        direction: 'ENTRANT',
        traite: false,
      },
    });

    if (config) {
      await this.traiterRapportWhatsApp(config.equipe, Body, From);
    }

    return { success: true };
  }

  private async traiterRapportWhatsApp(equipe: string, corps: string, from: string) {
    // Chercher chantier actif pour cette équipe
    const chantier = await this.prisma.chantier.findFirst({
      where: { equipe: equipe as any, actif: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!chantier) {
      await this.envoyerMessage(
        from,
        `❌ Aucun chantier actif trouvé pour l'équipe ${equipe}. Contactez le bureau.`,
      );
      return;
    }

    // Parser le rapport (format simple: avancement%, HJ, contenu)
    const lignes = corps.split('\n').filter(l => l.trim());
    let avancement = 0;
    let homesJour = 0;
    let problemes = '';
    let contenu = corps;

    for (const ligne of lignes) {
      const matchAv = ligne.match(/avancement[:\s]+(\d+)/i);
      const matchHJ = ligne.match(/(?:hj|hommes|hommes.jour)[:\s]+(\d+)/i);
      const matchProb = ligne.match(/(?:probl[eè]me|urgent|alerte)[:\s]+(.+)/i);

      if (matchAv) avancement = parseInt(matchAv[1]);
      if (matchHJ) homesJour = parseInt(matchHJ[1]);
      if (matchProb) problemes = matchProb[1];
    }

    await this.prisma.rapport.create({
      data: {
        chantierId: chantier.id,
        equipe: equipe as any,
        contenu,
        homesJour,
        avancement,
        problemes: problemes || undefined,
        source: 'WHATSAPP',
      },
    });

    // Confirmer réception
    await this.envoyerMessage(
      from,
      `✅ Rapport reçu pour ${chantier.nom}\n📊 Avancement: ${avancement}%\n👷 H/J: ${homesJour}\nMerci!`,
    );

    // Marquer messages comme traités
    await this.prisma.message.updateMany({
      where: { de: from, traite: false },
      data: { traite: true },
    });
  }
}
