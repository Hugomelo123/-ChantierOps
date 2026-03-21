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

  async envoyerInstructionEquipe(equipe: string, message: string): Promise<{ success: boolean }> {
    // Send to all active teams of this type
    const configs = await this.prisma.configEquipe.findMany({
      where: { type: equipe as any, actif: true },
    });

    if (configs.length === 0) {
      this.logger.warn(`Aucune équipe active de type ${equipe}`);
      return { success: false };
    }

    const texte = `📋 INSTRUCTIONS ChantierOps\nÉquipe ${equipe}:\n\n${message}\n\n_ChantierOps Luxembourg_`;
    for (const config of configs) {
      await this.envoyerMessage(config.numeroWhatsApp, texte);
    }
    return { success: true };
  }

  async traiterMessageEntrant(data: { From: string; Body: string; To: string }) {
    const { From, Body } = data;
    this.logger.log(`Message reçu de ${From}: ${Body}`);

    // Identify team by phone number
    const config = await this.prisma.configEquipe.findFirst({
      where: { numeroWhatsApp: From.replace('whatsapp:', '') },
    });

    await this.prisma.message.create({
      data: {
        de: From,
        vers: data.To,
        contenu: Body,
        equipe: config?.type,
        configEquipeId: config?.id,
        direction: 'ENTRANT',
        traite: false,
      },
    });

    if (config) {
      await this.traiterRapportWhatsApp(config, Body, From);
    }

    return { success: true };
  }

  private async traiterRapportWhatsApp(config: any, corps: string, from: string) {
    // Find the most recently updated active chantier assigned to this specific team
    const chantierEquipe = await this.prisma.chantierEquipe.findFirst({
      where: { configEquipeId: config.id, chantier: { actif: true } },
      include: { chantier: true },
      orderBy: { chantier: { updatedAt: 'desc' } },
    });

    if (!chantierEquipe) {
      await this.envoyerMessage(
        from,
        `❌ Aucun chantier actif trouvé pour l'équipe "${config.nom}". Contactez le bureau.`,
      );
      return;
    }

    const { chantier } = chantierEquipe;

    // Parse the report
    const lignes = corps.split('\n').filter(l => l.trim());
    let avancement = 0;
    let homesJour = 0;
    let problemes = '';
    const contenu = corps;

    for (const ligne of lignes) {
      const matchAv   = ligne.match(/avancement[:\s]+(\d+)/i);
      const matchHJ   = ligne.match(/(?:hj|hommes|hommes.jour)[:\s]+(\d+)/i);
      const matchProb = ligne.match(/(?:probl[eè]me|urgent|alerte)[:\s]+(.+)/i);
      if (matchAv)   avancement = Math.min(parseInt(matchAv[1]), 100);
      if (matchHJ)   homesJour  = parseInt(matchHJ[1]);
      if (matchProb) problemes  = matchProb[1];
    }

    const newStatus = problemes ? 'ALERTE' : 'OK';

    await this.prisma.rapport.create({
      data: {
        chantierId: chantier.id,
        configEquipeId: config.id,
        equipe: config.type,
        contenu,
        homesJour,
        avancement,
        problemes: problemes || undefined,
        source: 'WHATSAPP',
      },
    });

    await this.prisma.chantier.update({
      where: { id: chantier.id },
      data: { status: newStatus as any },
    });

    // Auto-resolve NON_RAPPORT alert for this team today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    await this.prisma.alerte.updateMany({
      where: {
        chantierId: chantier.id,
        configEquipeId: config.id,
        type: 'NON_RAPPORT',
        resolue: false,
        createdAt: { gte: startOfDay },
      },
      data: { resolue: true, resolueAt: new Date() },
    });

    await this.envoyerMessage(
      from,
      `✅ Rapport reçu — ${config.nom}\n🏗️ ${chantier.nom}\n📊 Avancement: ${avancement}%\n👷 H/J: ${homesJour}\nMerci!`,
    );

    await this.prisma.message.updateMany({
      where: { de: from, traite: false },
      data: { traite: true },
    });
  }
}
