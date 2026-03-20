import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RapportsService } from './rapports.service';
import { CreateRapportDto } from './dto/create-rapport.dto';

@ApiTags('Rapports')
@Controller('rapports')
export class RapportsController {
  constructor(private readonly rapportsService: RapportsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste les rapports' })
  findAll(
    @Query('equipe') equipe?: string,
    @Query('chantierId') chantierId?: string,
    @Query('date') date?: string,
  ) {
    return this.rapportsService.findAll({ equipe, chantierId, date });
  }

  @Get('today')
  @ApiOperation({ summary: 'Rapports du jour' })
  findToday(@Query('equipe') equipe?: string) {
    return this.rapportsService.findToday(equipe);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un rapport' })
  create(@Body() dto: CreateRapportDto) {
    return this.rapportsService.create(dto);
  }

  @Get('pdf/semaine')
  @ApiOperation({ summary: 'Rapport PDF semaine' })
  async pdfSemaine(@Query('equipe') equipe?: string) {
    return this.rapportsService.generatePdfSemaine(equipe);
  }

  @Get('pdf/mois')
  @ApiOperation({ summary: 'Rapport PDF mois' })
  async pdfMois(@Query('equipe') equipe?: string, @Query('mois') mois?: string) {
    return this.rapportsService.generatePdfMois(equipe, mois);
  }
}
