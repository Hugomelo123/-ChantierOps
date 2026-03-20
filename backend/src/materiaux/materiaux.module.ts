import { Module } from '@nestjs/common';
import { MateriauxController } from './materiaux.controller';
import { MateriauxService } from './materiaux.service';

@Module({
  controllers: [MateriauxController],
  providers: [MateriauxService],
  exports: [MateriauxService],
})
export class MateriauxModule {}
