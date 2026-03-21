import { Controller, Get, Post, Put, Body, Param, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { MateriauxService } from './materiaux.service';
import { CreateDemandeDto } from './dto/create-demande.dto';

@ApiTags('Matériaux')
@Controller('materiaux')
export class MateriauxController {
  constructor(private readonly materiauxService: MateriauxService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les demandes de matériaux' })
  findAll(
    @Query('equipe') equipe?: string,
    @Query('statut') statut?: string,
    @Query('urgence') urgence?: string,
  ) {
    return this.materiauxService.findAll({ equipe, statut, urgence });
  }

  @Post()
  @ApiOperation({ summary: 'Créer une demande de matériau' })
  create(@Body() dto: CreateDemandeDto) {
    return this.materiauxService.create(dto);
  }

  @Put(':id/statut')
  @ApiOperation({ summary: 'Modifier statut demande' })
  updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
    return this.materiauxService.updateStatut(id, statut);
  }

  @Get('pdf/semaine')
  @ApiOperation({ summary: 'Rapport PDF matériaux semaine' })
  async pdfSemaine(@Res() res: Response, @Query('equipe') equipe?: string) {
    const pdf = await this.materiauxService.generatePdfSemaine(equipe);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="materiaux-semaine.pdf"',
    });
    res.send(pdf);
  }

  @Get('pdf/mois')
  @ApiOperation({ summary: 'Rapport PDF matériaux mois' })
  async pdfMois(
    @Res() res: Response,
    @Query('equipe') equipe?: string,
    @Query('mois') mois?: string,
  ) {
    const pdf = await this.materiauxService.generatePdfMois(equipe, mois);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="materiaux-mois.pdf"',
    });
    res.send(pdf);
  }

  @Get('pdf/chantier')
  @ApiOperation({ summary: 'Rapport PDF matériaux par chantier' })
  async pdfParChantier(
    @Res() res: Response,
    @Query('chantierId') chantierId?: string,
    @Query('mois') mois?: string,
  ) {
    const pdf = await this.materiauxService.generatePdfParChantier(chantierId, mois);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="materiaux-par-chantier.pdf"',
    });
    res.send(pdf);
  }
}
