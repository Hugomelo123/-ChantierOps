import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      chantiersActifs,
      alertesOuvertes,
      rapportsAujourdhui,
      demandesUrgentes,
      totalHJMois,
      chantiersByStatus,
      chantiersByEquipe,
      alertesByEquipe,
      rapports7j,
    ] = await Promise.all([
      this.prisma.chantier.count({ where: { actif: true } }),

      this.prisma.alerte.count({ where: { resolue: false } }),

      this.prisma.rapport.count({ where: { date: { gte: startOfDay } } }),

      this.prisma.demandeMateriau.count({
        where: { statut: 'EN_ATTENTE', urgence: { in: ['URGENT', 'CRITIQUE'] } },
      }),

      this.prisma.rapport.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { homesJour: true },
      }),

      this.prisma.chantier.groupBy({
        by: ['status'],
        where: { actif: true },
        _count: true,
      }),

      this.prisma.chantier.groupBy({
        by: ['equipe'],
        where: { actif: true },
        _count: true,
      }),

      this.prisma.alerte.groupBy({
        by: ['equipe'],
        where: { resolue: false },
        _count: true,
      }),

      this.prisma.rapport.findMany({
        where: { date: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
        select: { date: true, equipe: true, homesJour: true, avancement: true },
        orderBy: { date: 'asc' },
      }),
    ]);

    // Chantiers avec alertes actives
    const chantiersAlerte = await this.prisma.chantier.findMany({
      where: { actif: true, status: 'ALERTE' },
      select: { id: true, nom: true, equipe: true, adresse: true, ville: true },
      take: 5,
    });

    // Dernières demandes urgentes
    const dernieresUrgences = await this.prisma.demandeMateriau.findMany({
      where: { urgence: { in: ['URGENT', 'CRITIQUE'] }, statut: 'EN_ATTENTE' },
      include: { chantier: { select: { nom: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      kpis: {
        chantiersActifs,
        alertesOuvertes,
        rapportsAujourdhui,
        demandesUrgentes,
        homesJourMois: totalHJMois._sum.homesJour || 0,
      },
      chantiersByStatus: Object.fromEntries(
        chantiersByStatus.map(g => [g.status, g._count]),
      ),
      chantiersByEquipe: Object.fromEntries(
        chantiersByEquipe.map(g => [g.equipe, g._count]),
      ),
      alertesByEquipe: Object.fromEntries(
        alertesByEquipe.map(g => [g.equipe, g._count]),
      ),
      chantiersAlerte,
      dernieresUrgences,
      rapports7j,
    };
  }
}
