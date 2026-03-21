import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.configEquipe.findMany({
      orderBy: [{ type: 'asc' }, { nom: 'asc' }],
    });
  }

  async create(data: { type: string; nom: string; chefNom: string; numeroWhatsApp: string; heureRapport?: string }) {
    return this.prisma.configEquipe.create({ data: data as any });
  }

  async update(id: string, data: { nom?: string; chefNom?: string; numeroWhatsApp?: string; heureRapport?: string }) {
    return this.prisma.configEquipe.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.configEquipe.delete({ where: { id } });
  }

  /** @deprecated kept for backward compat — use create/update instead */
  async upsert(equipe: string, data: { numeroWhatsApp: string; chefNom: string; heureRapport?: string }) {
    const existing = await this.prisma.configEquipe.findFirst({
      where: { type: equipe as any, nom: { startsWith: equipe } },
    });
    if (existing) {
      return this.prisma.configEquipe.update({ where: { id: existing.id }, data });
    }
    return this.prisma.configEquipe.create({
      data: { type: equipe as any, nom: `${equipe} A`, ...data },
    });
  }

  async getStats(type?: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const where: any = {};
    if (type) where.equipe = type;

    const [rapportsMois, alertesOuvertes, demandesEnAttente] = await Promise.all([
      this.prisma.rapport.count({ where: { ...where, date: { gte: startOfMonth } } }),
      this.prisma.alerte.count({ where: { ...where, resolue: false } }),
      this.prisma.demandeMateriau.count({ where: { ...where, statut: 'EN_ATTENTE' } }),
    ]);

    const hjMois = await this.prisma.rapport.aggregate({
      where: { ...where, date: { gte: startOfMonth } },
      _sum: { homesJour: true },
    });

    // Count chantiers via ChantierEquipe join
    const chantierIds = await this.prisma.chantierEquipe.findMany({
      where: type ? { configEquipe: { type: type as any } } : {},
      select: { chantierId: true },
      distinct: ['chantierId'],
    });

    return {
      equipe: type,
      chantiers: chantierIds.length,
      rapportsMois,
      alertesOuvertes,
      demandesEnAttente,
      homesJourMois: hjMois._sum.homesJour || 0,
    };
  }
}
