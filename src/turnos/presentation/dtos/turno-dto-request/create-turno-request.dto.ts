import { IsString, IsNotEmpty, IsDateString, IsOptional, IsMongoId } from 'class-validator';
import { CreateTurnoServiceDto } from '../../../services/dto/create-turno-service.dto.js';

export class CreateTurnoRequestDto {
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

  @IsMongoId()
  @IsNotEmpty()
  private readonly clienteId: string;

  @IsOptional()
  @IsString()
  private readonly notas?: string;

  constructor(
    fecha: string,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.clienteId = clienteId;
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

  getClienteId(): string {
    return this.clienteId;
  }

  getNotas(): string | undefined {
    return this.notas;
  }

  toServiceDto(): CreateTurnoServiceDto {
    return new CreateTurnoServiceDto(
      new Date(this.fecha),
      this.horaInicio,
      this.proveedorId,
      this.servicioId,
      this.clienteId,
      this.notas,
    );
  }
}
