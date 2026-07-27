import { IsString, IsNotEmpty, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientGuestDetailsDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  celular?: string;
}

export class CreateGuestPreferenceRequestDto {
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

  @IsString()
  @IsOptional()
  notas?: string;

  @ValidateNested()
  @Type(() => ClientGuestDetailsDto)
  @IsNotEmpty()
  guestDetails: ClientGuestDetailsDto;
}
