import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EquipesService } from './equipes.service';

@ApiTags('Équipes')
@Controller('equipes')
export class EquipesController {
  constructor(private readonly equipesService: EquipesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste toutes les équipes' })
  findAll() {
    return this.equipesService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales ou par type' })
  getStats(@Query('type') type?: string) {
    return this.equipesService.getStats(type);
  }

  @Get(':equipe/stats')
  @ApiOperation({ summary: 'Statistiques par type (legacy)' })
  getStatsByType(@Param('equipe') equipe: string) {
    return this.equipesService.getStats(equipe.toUpperCase());
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle équipe' })
  create(@Body() data: { type: string; nom: string; chefNom: string; numeroWhatsApp: string; heureRapport?: string }) {
    return this.equipesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une équipe' })
  update(
    @Param('id') id: string,
    @Body() data: { nom?: string; chefNom?: string; numeroWhatsApp?: string; heureRapport?: string },
  ) {
    return this.equipesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une équipe' })
  remove(@Param('id') id: string) {
    return this.equipesService.remove(id);
  }

  @Post(':equipe/config')
  @ApiOperation({ summary: 'Configurer une équipe (legacy)' })
  upsert(
    @Param('equipe') equipe: string,
    @Body() data: { numeroWhatsApp: string; chefNom: string; heureRapport?: string },
  ) {
    return this.equipesService.upsert(equipe.toUpperCase(), data);
  }
}
