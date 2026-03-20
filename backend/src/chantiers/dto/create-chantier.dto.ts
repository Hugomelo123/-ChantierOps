import { IsString, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChantierDto {
  @ApiProperty()
  @IsString()
  nom: string;

  @ApiProperty()
  @IsString()
  adresse: string;

  @ApiProperty()
  @IsString()
  ville: string;

  @ApiProperty()
  @IsString()
  codePostal: string;

  @ApiProperty({ enum: ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'] })
  @IsEnum(['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'])
  equipe: string;

  @ApiProperty()
  @IsDateString()
  dateDebut: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dateFin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
