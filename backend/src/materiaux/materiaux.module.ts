import { Module } from '@nestjs/common';
import { MateriauxController } from './materiaux.controller';
import { MateriauxService } from './materiaux.service';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [WhatsappModule],
  controllers: [MateriauxController],
  providers: [MateriauxService],
  exports: [MateriauxService],
})
export class MateriauxModule {}
