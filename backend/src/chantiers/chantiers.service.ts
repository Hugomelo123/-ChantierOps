import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';

@Injectable()
export class ChantiersService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { equipe?: string; actif?: boolean }) {
    const where: any = {};
    if (filters.equipe) where.equipe = filters.equipe;
    if (filters.actif !== undefined) where.actif = filters.actif;

    return this.prisma.chantier.findMany({
      where,
      include: {
        rapports: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        alertes: {
          where: { resolue: false },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { rapports: true, alertes: true, demandesMat: true },
        },
      },
      orderBy: [{ status: 'asc' }, { nom: 'asc' }],
    });
  }

  async findOne(id: string) {
    const chantier = await this.prisma.chantier.findUnique({
      where: { id },
      include: {
        rapports: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        alertes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        demandesMat: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!chantier) throw new NotFoundException(`Chantier ${id} introuvable`);
    return chantier;
  }

  async create(dto: CreateChantierDto) {
    return this.prisma.chantier.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateChantierDto) {
    await this.findOne(id);
    return this.prisma.chantier.update({ where: { id }, data: dto as any });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);
    return this.prisma.chantier.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.chantier.update({
      where: { id },
      data: { actif: false },
    });
  }
}
