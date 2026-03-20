import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDemandeDto {
  @ApiProperty()
  @IsString()
  chantierId: string;

  @ApiProperty({ enum: ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'] })
  @IsEnum(['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'])
  equipe: string;

  @ApiProperty()
  @IsString()
  materiau: string;

  @ApiProperty()
  @IsNumber()
  quantite: number;

  @ApiProperty()
  @IsString()
  unite: string;

  @ApiProperty({ enum: ['NORMAL', 'URGENT', 'CRITIQUE'], required: false })
  @IsEnum(['NORMAL', 'URGENT', 'CRITIQUE'])
  @IsOptional()
  urgence?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
