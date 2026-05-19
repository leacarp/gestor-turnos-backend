import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreatePreferenceRequestDto {
  @IsString()
  @IsNotEmpty()
  proveedorId: string;

  @IsString()
  @IsNotEmpty()
  servicioId: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
