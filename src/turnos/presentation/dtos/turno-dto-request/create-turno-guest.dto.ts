import { IsString, IsNotEmpty, IsDateString, IsOptional, IsMongoId } from 'class-validator';
import { CreateTurnoGuestServiceDto } from 'src/turnos/services/dto/create-turno-guest-service.dto';
import { GuestDetailsRequestDto } from './guestDetails-request.dto.js';

export class CreateTurnoGuestRequestDto {
  @IsDateString()
  @IsNotEmpty()
  private readonly fecha: string;

  @IsString()
  @IsNotEmpty()
  private readonly horaInicio: string;

  @IsMongoId()
  @IsNotEmpty()
  private readonly proveedorId: string;

  @IsMongoId()
  @IsNotEmpty()
  private readonly servicioId: string;

  @IsNotEmpty()
  private readonly GuestDetails : GuestDetailsRequestDto;

  @IsOptional()
  @IsString()
  private readonly notas?: string;

  constructor(
    fecha: string,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    GuestDetails: GuestDetailsRequestDto,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.GuestDetails = GuestDetails;
    this.notas = notas;
  }

  getFecha(): string {
    return this.fecha;
  }

  getHoraInicio(): string {
    return this.horaInicio;
  }

  getProveedorId(): string {
    return this.proveedorId;
  }

  getServicioId(): string {
    return this.servicioId;
  }

  getGuestDetails() : GuestDetailsRequestDto{
    return this.GuestDetails;
  }
  
  getNotas(): string | undefined {
    return this.notas;
  }

  toServiceDto(): CreateTurnoGuestServiceDto {
    return new CreateTurnoGuestServiceDto(
      new Date(this.fecha),
      this.horaInicio,
      this.proveedorId,
      this.servicioId,
      this.GuestDetails.toServiceDto(),
      this.notas,
    );
  }
}
