import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AlertesService {
  private readonly logger = new Logger(AlertesService.name);

  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsappService,
  ) {}

  async findAll(filters: { equipe?: string; resolue?: boolean }) {
    const where: any = {};
    if (filters.equipe) where.equipe = filters.equipe;
    if (filters.resolue !== undefined) where.resolue = filters.resolue;

    return this.prisma.alerte.findMany({
      where,
      include: { chantier: { select: { nom: true, adresse: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(data: {
    chantierId: string;
    equipe: string;
    type: string;
    message: string;
  }) {
    return this.prisma.alerte.create({ data: data as any });
  }

  async resoudre(id: string) {
    return this.prisma.alerte.update({
      where: { id },
      data: { resolue: true, resolueAt: new Date() },
    });
  }

  // Vérifie chaque jour à 17h05 (heure Luxembourg) si les équipes ont envoyé leur rapport
  @Cron('5 17 * * 1-5', { timeZone: 'Europe/Luxembourg' })
  async verifierRapportsManquants() {
    this.logger.log('Vérification des rapports manquants...');

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const chantiersActifs = await this.prisma.chantier.findMany({
      where: { actif: true },
    });

    for (const chantier of chantiersActifs) {
      const rapport = await this.prisma.rapport.findFirst({
        where: {
          chantierId: chantier.id,
          date: { gte: startOfDay },
        },
      });

      if (!rapport) {
        // Éviter doublons: vérifier si alerte NON_RAPPORT déjà créée aujourd'hui
        const alerteExistante = await this.prisma.alerte.findFirst({
          where: {
            chantierId: chantier.id,
            type: 'NON_RAPPORT',
            resolue: false,
            createdAt: { gte: startOfDay },
          },
        });
        if (alerteExistante) continue;

        await this.create({
          chantierId: chantier.id,
          equipe: chantier.equipe,
          type: 'NON_RAPPORT',
          message: `Aucun rapport reçu aujourd'hui pour le chantier "${chantier.nom}"`,
        });

        await this.prisma.chantier.update({
          where: { id: chantier.id },
          data: { status: 'ALERTE' },
        });

        const config = await this.prisma.configEquipe.findUnique({
          where: { equipe: chantier.equipe as any },
        });

        if (config) {
          await this.whatsapp.envoyerMessage(
            config.numeroWhatsApp,
            `⚠️ ALERTE ChantierOps\nAucun rapport reçu pour le chantier "${chantier.nom}" (${chantier.adresse}).\nMerci d'envoyer votre rapport dès que possible.`,
          );
        }

        this.logger.warn(`Alerte créée: ${chantier.nom} - ${chantier.equipe}`);
      }
    }
  }
}
