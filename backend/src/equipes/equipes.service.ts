import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.configEquipe.findMany({
      orderBy: { equipe: 'asc' },
    });
  }

  async upsert(equipe: string, data: {
    numeroWhatsApp: string;
    chefNom: string;
    heureRapport?: string;
  }) {
    return this.prisma.configEquipe.upsert({
      where: { equipe: equipe as any },
      create: { equipe: equipe as any, ...data },
      update: data,
    });
  }

  async getStats(equipe: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);

    const [chantiers, rapportsMois, alertesOuvertes, demandesEnAttente] = await Promise.all([
      this.prisma.chantier.count({ where: { equipe: equipe as any, actif: true } }),
      this.prisma.rapport.count({
        where: { equipe: equipe as any, date: { gte: startOfMonth } },
      }),
      this.prisma.alerte.count({
        where: { equipe: equipe as any, resolue: false },
      }),
      this.prisma.demandeMateriau.count({
        where: { equipe: equipe as any, statut: 'EN_ATTENTE' },
      }),
    ]);

    const hjMois = await this.prisma.rapport.aggregate({
      where: { equipe: equipe as any, date: { gte: startOfMonth } },
      _sum: { homesJour: true },
    });

    return {
      equipe,
      chantiers,
      rapportsMois,
      alertesOuvertes,
      demandesEnAttente,
      homesJourMois: hjMois._sum.homesJour || 0,
    };
  }
}
