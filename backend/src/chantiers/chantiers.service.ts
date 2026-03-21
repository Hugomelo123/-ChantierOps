import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';

const EQUIPES_INCLUDE = {
  equipes: {
    include: {
      configEquipe: { select: { id: true, type: true, nom: true, chefNom: true, numeroWhatsApp: true } },
    },
  },
};

@Injectable()
export class ChantiersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { equipe?: string; actif?: boolean }) {
    const where: any = {};
    if (filters.actif !== undefined) where.actif = filters.actif;

    // Filter by team type via ChantierEquipe join
    if (filters.equipe) {
      where.equipes = {
        some: { configEquipe: { type: filters.equipe as any } },
      };
    }

    return this.prisma.chantier.findMany({
      where,
      include: {
        ...EQUIPES_INCLUDE,
        rapports: { orderBy: { date: 'desc' }, take: 1 },
        alertes: { where: { resolue: false }, orderBy: { createdAt: 'desc' } },
        _count: { select: { rapports: true, alertes: true, demandesMat: true } },
      },
      orderBy: [{ status: 'asc' }, { nom: 'asc' }],
    });
  }

  async findOne(id: string) {
    const chantier = await this.prisma.chantier.findUnique({
      where: { id },
      include: {
        ...EQUIPES_INCLUDE,
        rapports: {
          orderBy: { date: 'desc' },
          take: 10,
          include: { configEquipe: { select: { nom: true, type: true } } },
        },
        alertes: { orderBy: { createdAt: 'desc' }, take: 10 },
        demandesMat: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { rapports: true, alertes: true, demandesMat: true } },
      },
    });

    if (!chantier) throw new NotFoundException(`Chantier ${id} introuvable`);
    return chantier;
  }

  async create(dto: CreateChantierDto) {
    const { teamIds, ...chantierData } = dto as any;
    const chantier = await this.prisma.chantier.create({ data: chantierData });

    if (teamIds && teamIds.length > 0) {
      await this.prisma.chantierEquipe.createMany({
        data: teamIds.map((configEquipeId: string) => ({ chantierId: chantier.id, configEquipeId })),
        skipDuplicates: true,
      });
    }

    return this.findOne(chantier.id);
  }

  async update(id: string, dto: UpdateChantierDto) {
    await this.findOne(id);
    const { teamIds, ...data } = dto as any;

    await this.prisma.chantier.update({ where: { id }, data });

    // Replace team assignments if provided
    if (teamIds !== undefined) {
      await this.prisma.chantierEquipe.deleteMany({ where: { chantierId: id } });
      if (teamIds.length > 0) {
        await this.prisma.chantierEquipe.createMany({
          data: teamIds.map((configEquipeId: string) => ({ chantierId: id, configEquipeId })),
          skipDuplicates: true,
        });
      }
    }

    return this.findOne(id);
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.chantier.update({ where: { id }, data: { status: status as any } });
  }

  async addEquipe(chantierId: string, configEquipeId: string) {
    return this.prisma.chantierEquipe.upsert({
      where: { chantierId_configEquipeId: { chantierId, configEquipeId } },
      create: { chantierId, configEquipeId },
      update: {},
    });
  }

  async removeEquipe(chantierId: string, configEquipeId: string) {
    return this.prisma.chantierEquipe.delete({
      where: { chantierId_configEquipeId: { chantierId, configEquipeId } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.chantier.update({ where: { id }, data: { actif: false } });
  }
}
