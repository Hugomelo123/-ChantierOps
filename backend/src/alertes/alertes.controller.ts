import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlertesService } from './alertes.service';

@ApiTags('Alertes')
@Controller('alertes')
export class AlertesController {
  constructor(private readonly alertesService: AlertesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les alertes' })
  findAll(@Query('equipe') equipe?: string, @Query('resolue') resolue?: string) {
    return this.alertesService.findAll({
      equipe,
      resolue: resolue === 'true' ? true : resolue === 'false' ? false : undefined,
    });
  }

  @Post(':id/resoudre')
  @ApiOperation({ summary: 'Résoudre une alerte' })
  resoudre(@Param('id') id: string) {
    return this.alertesService.resoudre(id);
  }
}
