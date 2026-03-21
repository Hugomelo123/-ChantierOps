import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';
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

  @ApiProperty({ required: false, type: [String], description: 'IDs des ConfigEquipe à assigner' })
  @IsArray()
  @IsOptional()
  teamIds?: string[];
}
