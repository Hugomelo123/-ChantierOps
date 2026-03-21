import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
      include: {
        chantier: { select: { nom: true, adresse: true } },
        configEquipe: { select: { nom: true, type: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(data: {
    chantierId: string;
    equipe: string;
    configEquipeId?: string;
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

  // Every weekday at 17:05 Luxembourg time — check each team on each active chantier
  @Cron('5 17 * * 1-5', { timeZone: 'Europe/Luxembourg' })
  async verifierRapportsManquants() {
    this.logger.log('Vérification des rapports manquants...');

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const chantiersActifs = await this.prisma.chantier.findMany({
      where: { actif: true },
      include: {
        equipes: { include: { configEquipe: true } },
      },
    });

    for (const chantier of chantiersActifs) {
      for (const { configEquipe } of chantier.equipes) {
        // Check if this specific team sent a report today
        const rapport = await this.prisma.rapport.findFirst({
          where: {
            chantierId: chantier.id,
            configEquipeId: configEquipe.id,
            date: { gte: startOfDay },
          },
        });

        if (!rapport) {
          // Avoid duplicates
          const alerteExistante = await this.prisma.alerte.findFirst({
            where: {
              chantierId: chantier.id,
              configEquipeId: configEquipe.id,
              type: 'NON_RAPPORT',
              resolue: false,
              createdAt: { gte: startOfDay },
            },
          });
          if (alerteExistante) continue;

          await this.create({
            chantierId: chantier.id,
            equipe: configEquipe.type,
            configEquipeId: configEquipe.id,
            type: 'NON_RAPPORT',
            message: `Aucun rapport reçu aujourd'hui de "${configEquipe.nom}" pour "${chantier.nom}"`,
          });

          await this.prisma.chantier.update({
            where: { id: chantier.id },
            data: { status: 'ALERTE' },
          });

          await this.whatsapp.envoyerMessage(
            configEquipe.numeroWhatsApp,
            `⚠️ ALERTE ChantierOps\nAucun rapport reçu pour "${chantier.nom}" (${chantier.adresse}).\nMerci d'envoyer votre rapport dès que possible.`,
          );

          this.logger.warn(`Alerte NON_RAPPORT: ${configEquipe.nom} — ${chantier.nom}`);
        }
      }
    }
  }
}
