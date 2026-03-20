import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { ChantiersModule } from './chantiers/chantiers.module';
import { EquipesModule } from './equipes/equipes.module';
import { RapportsModule } from './rapports/rapports.module';
import { AlertesModule } from './alertes/alertes.module';
import { MateriauxModule } from './materiaux/materiaux.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ChantiersModule,
    EquipesModule,
    RapportsModule,
    AlertesModule,
    MateriauxModule,
    WhatsappModule,
    DashboardModule,
  ],
})
export class AppModule {}
