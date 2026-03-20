import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class MateriauxService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { equipe?: string; statut?: string; urgence?: string }) {
    const where: any = {};
    if (filters.equipe) where.equipe = filters.equipe;
    if (filters.statut) where.statut = filters.statut;
    if (filters.urgence) where.urgence = filters.urgence;

    return this.prisma.demandeMateriau.findMany({
      where,
      include: { chantier: { select: { nom: true, adresse: true, ville: true } } },
      orderBy: [{ urgence: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(dto: CreateDemandeDto) {
    return this.prisma.demandeMateriau.create({ data: dto });
  }

  async updateStatut(id: string, statut: string) {
    const data: any = { statut };
    if (statut === 'LIVRE') data.livreeLe = new Date();
    return this.prisma.demandeMateriau.update({ where: { id }, data });
  }

  async generatePdfSemaine(equipe?: string): Promise<Buffer> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const where: any = { createdAt: { gte: startOfWeek } };
    if (equipe) where.equipe = equipe;

    const demandes = await this.prisma.demandeMateriau.findMany({
      where,
      include: { chantier: true },
      orderBy: [{ urgence: 'desc' }, { equipe: 'asc' }],
    });

    return this.buildPdf('Rapport Matériaux - Semaine', demandes, startOfWeek, now);
  }

  async generatePdfMois(equipe?: string, mois?: string): Promise<Buffer> {
    const date = mois ? new Date(mois + '-01') : new Date();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const where: any = { createdAt: { gte: start, lte: end } };
    if (equipe) where.equipe = equipe;

    const demandes = await this.prisma.demandeMateriau.findMany({
      where,
      include: { chantier: true },
      orderBy: [{ urgence: 'desc' }, { equipe: 'asc' }],
    });

    return this.buildPdf('Rapport Matériaux - Mensuel', demandes, start, end);
  }

  private buildPdf(titre: string, demandes: any[], debut: Date, fin: Date): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const urgenceColors = { CRITIQUE: '#c0392b', URGENT: '#e67e22', NORMAL: '#27ae60' };
      const statutLabels = {
        EN_ATTENTE: 'En attente',
        APPROUVE: 'Approuvé',
        LIVRE: 'Livré',
        REFUSE: 'Refusé',
      };

      // Header
      doc.fillColor('#1e3a5f').rect(0, 0, doc.page.width, 80).fill();
      doc.fillColor('white').fontSize(22).text('ChantierOps', 50, 20);
      doc.fontSize(14).text(titre, 50, 48);
      doc.fillColor('#666').fontSize(10)
        .text(`Période: ${debut.toLocaleDateString('fr-FR')} - ${fin.toLocaleDateString('fr-FR')}`, 50, 95);

      doc.moveDown(3);

      // Summary
      const stats = {
        total: demandes.length,
        critiques: demandes.filter(d => d.urgence === 'CRITIQUE').length,
        urgents: demandes.filter(d => d.urgence === 'URGENT').length,
        livres: demandes.filter(d => d.statut === 'LIVRE').length,
      };

      doc.fillColor('#1e3a5f').fontSize(12).text('Résumé');
      doc.fillColor('#333').fontSize(10)
        .text(`Total demandes: ${stats.total} | Critiques: ${stats.critiques} | Urgents: ${stats.urgents} | Livrés: ${stats.livres}`);
      doc.moveDown(1);

      // By equipe
      const byEquipe: Record<string, any[]> = {};
      for (const d of demandes) {
        if (!byEquipe[d.equipe]) byEquipe[d.equipe] = [];
        byEquipe[d.equipe].push(d);
      }

      for (const [equipe, items] of Object.entries(byEquipe)) {
        doc.fillColor('#1e3a5f').fontSize(13).text(`Équipe ${equipe}`, { underline: true });
        doc.moveDown(0.5);

        for (const d of items) {
          const color = urgenceColors[d.urgence] || '#333';
          doc.fillColor(color).fontSize(10)
            .text(`[${d.urgence}] ${d.materiau} - ${d.quantite} ${d.unite}`);
          doc.fillColor('#333').fontSize(9)
            .text(`  Chantier: ${d.chantier.nom} | Statut: ${statutLabels[d.statut] || d.statut} | ${new Date(d.createdAt).toLocaleDateString('fr-FR')}`);
          if (d.notes) doc.fillColor('#666').fontSize(9).text(`  Notes: ${d.notes}`);
          doc.moveDown(0.3);
        }
        doc.moveDown(1);
      }

      if (demandes.length === 0) {
        doc.fillColor('#666').fontSize(12).text('Aucune demande pour cette période.');
      }

      doc.end();
    });
  }
}
