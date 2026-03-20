import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ChantiersService } from './chantiers.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';

@ApiTags('Chantiers')
@Controller('chantiers')
export class ChantiersController {
  constructor(private readonly chantiersService: ChantiersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste tous les chantiers' })
  findAll(@Query('equipe') equipe?: string, @Query('actif') actif?: string) {
    return this.chantiersService.findAll({ equipe, actif: actif !== 'false' });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un chantier' })
  findOne(@Param('id') id: string) {
    return this.chantiersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un chantier' })
  create(@Body() dto: CreateChantierDto) {
    return this.chantiersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un chantier' })
  update(@Param('id') id: string, @Body() dto: UpdateChantierDto) {
    return this.chantiersService.update(id, dto);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Changer le status d\'un chantier' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.chantiersService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Désactiver un chantier' })
  remove(@Param('id') id: string) {
    return this.chantiersService.remove(id);
  }
}
