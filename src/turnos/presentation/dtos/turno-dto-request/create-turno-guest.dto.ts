import { IsString, IsNotEmpty, IsDateString, IsOptional, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTurnoGuestServiceDto } from 'src/turnos/services/dto/create-turno-guest-service.dto';
import { ClienteRequestDto } from './clientDetails-request.dto';

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

  @ValidateNested()
  @Type(() => ClienteRequestDto)
  @IsNotEmpty()
  private readonly clienteDetails : ClienteRequestDto;

  @IsOptional()
  @IsString()
  private readonly notas?: string;

  constructor(
    fecha: string,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    GuestDetails: ClienteRequestDto,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.clienteDetails = GuestDetails;
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

  getGuestDetails() : ClienteRequestDto{
    return this.clienteDetails;
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
      this.clienteDetails.toServiceDto(),
      this.notas,
    );
  }
}
