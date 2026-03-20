import { Module } from '@nestjs/common';
import { AlertesController } from './alertes.controller';
import { AlertesService } from './alertes.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [WhatsappModule],
  controllers: [AlertesController],
  providers: [AlertesService],
  exports: [AlertesService],
})
export class AlertesModule {}
