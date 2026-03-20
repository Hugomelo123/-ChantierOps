import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRapportDto } from './dto/create-rapport.dto';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class RapportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { equipe?: string; chantierId?: string; date?: string }) {
    const where: any = {};
    if (filters.equipe) where.equipe = filters.equipe;
    if (filters.chantierId) where.chantierId = filters.chantierId;
    if (filters.date) {
      const d = new Date(filters.date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      where.date = { gte: start, lte: end };
    }

    return this.prisma.rapport.findMany({
      where,
      include: { chantier: { select: { nom: true, adresse: true, ville: true } } },
      orderBy: { date: 'desc' },
      take: 100,
    });
  }

  async findToday(equipe?: string) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const where: any = { date: { gte: start, lte: end } };
    if (equipe) where.equipe = equipe;

    return this.prisma.rapport.findMany({
      where,
      include: { chantier: { select: { nom: true, adresse: true, ville: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async create(dto: CreateRapportDto) {
    const rapport = await this.prisma.rapport.create({ data: dto });

    // Update chantier status based on avancement
    if (dto.avancement !== undefined) {
      let status = 'OK';
      if (dto.avancement < 50) status = 'PARTIEL';
      if (dto.problemes && dto.problemes.length > 0) status = 'ALERTE';

      await this.prisma.chantier.update({
        where: { id: dto.chantierId },
        data: { status: status as any },
      });
    }

    return rapport;
  }

  async generatePdfSemaine(equipe?: string): Promise<Buffer> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const where: any = { date: { gte: startOfWeek } };
    if (equipe) where.equipe = equipe;

    const rapports = await this.prisma.rapport.findMany({
      where,
      include: { chantier: true },
      orderBy: [{ equipe: 'asc' }, { date: 'asc' }],
    });

    return this.buildPdf('Rapport Hebdomadaire', rapports, startOfWeek, now);
  }

  async generatePdfMois(equipe?: string, mois?: string): Promise<Buffer> {
    const date = mois ? new Date(mois + '-01') : new Date();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const where: any = { date: { gte: start, lte: end } };
    if (equipe) where.equipe = equipe;

    const rapports = await this.prisma.rapport.findMany({
      where,
      include: { chantier: true },
      orderBy: [{ equipe: 'asc' }, { date: 'asc' }],
    });

    return this.buildPdf('Rapport Mensuel', rapports, start, end);
  }

  private buildPdf(titre: string, rapports: any[], debut: Date, fin: Date): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fillColor('#1e3a5f').rect(0, 0, doc.page.width, 80).fill();
      doc.fillColor('white').fontSize(22).text('ChantierOps', 50, 20);
      doc.fontSize(14).text(titre, 50, 48);
      doc.fillColor('#666').fontSize(10)
        .text(`Période: ${debut.toLocaleDateString('fr-FR')} - ${fin.toLocaleDateString('fr-FR')}`, 50, 95);

      doc.moveDown(3);

      // Group by equipe
      const byEquipe: Record<string, any[]> = {};
      for (const r of rapports) {
        if (!byEquipe[r.equipe]) byEquipe[r.equipe] = [];
        byEquipe[r.equipe].push(r);
      }

      for (const [equipe, raps] of Object.entries(byEquipe)) {
        doc.fillColor('#1e3a5f').fontSize(14).text(`Équipe ${equipe}`, { underline: true });
        doc.moveDown(0.5);

        const totalHJ = raps.reduce((s, r) => s + r.homesJour, 0);
        doc.fillColor('#333').fontSize(10)
          .text(`Total rapports: ${raps.length} | Total hommes·jour: ${totalHJ}`);
        doc.moveDown(0.5);

        for (const r of raps) {
          doc.fillColor('#1e3a5f').fontSize(10)
            .text(`${new Date(r.date).toLocaleDateString('fr-FR')} - ${r.chantier.nom}`);
          doc.fillColor('#333').fontSize(9)
            .text(`  Avancement: ${r.avancement}% | H/J: ${r.homesJour} | ${r.contenu}`);
          if (r.problemes) {
            doc.fillColor('#c0392b').fontSize(9).text(`  Problèmes: ${r.problemes}`);
          }
          doc.moveDown(0.3);
        }

        doc.moveDown(1);
      }

      if (rapports.length === 0) {
        doc.fillColor('#666').fontSize(12).text('Aucun rapport pour cette période.');
      }

      doc.end();
    });
  }
}
