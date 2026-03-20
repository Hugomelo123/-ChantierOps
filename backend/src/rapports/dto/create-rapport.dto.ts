import { IsString, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRapportDto {
  @ApiProperty()
  @IsString()
  chantierId: string;

  @ApiProperty({ enum: ['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'] })
  @IsEnum(['CARRELAGE', 'MACONNERIE', 'FACADE', 'ELECTRICITE'])
  equipe: string;

  @ApiProperty()
  @IsString()
  contenu: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  homesJour?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  avancement?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  problemes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  source?: string;
}
