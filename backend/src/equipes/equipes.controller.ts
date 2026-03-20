import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EquipesService } from './equipes.service';

@ApiTags('Équipes')
@Controller('equipes')
export class EquipesController {
  constructor(private readonly equipesService: EquipesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les configurations équipes' })
  findAll() {
    return this.equipesService.findAll();
  }

  @Get(':equipe/stats')
  @ApiOperation({ summary: 'Statistiques d\'une équipe' })
  getStats(@Param('equipe') equipe: string) {
    return this.equipesService.getStats(equipe.toUpperCase());
  }

  @Post(':equipe/config')
  @ApiOperation({ summary: 'Configurer une équipe' })
  upsert(
    @Param('equipe') equipe: string,
    @Body() data: { numeroWhatsApp: string; chefNom: string; heureRapport?: string },
  ) {
    return this.equipesService.upsert(equipe.toUpperCase(), data);
  }
}
