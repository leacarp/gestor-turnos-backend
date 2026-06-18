import { IsString, IsNotEmpty, IsDateString, IsOptional, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTurnoServiceDto } from '../../../services/dto/create-turno-service.dto.js';
import { ClienteRequestDto } from './clientDetails-request.dto.js';
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

  @ValidateNested()
  @Type(() => ClienteRequestDto)
  @IsNotEmpty()
  private readonly cliente: ClienteRequestDto;

  @IsOptional()
  @IsString()
  private readonly notas?: string;

  constructor(
    fecha: string,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    cliente: ClienteRequestDto,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.cliente = cliente;
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

  getCliente(): ClienteRequestDto {
    return this.cliente;
  }

  getNotas(): string | undefined {
    return this.notas;
  }

  toServiceDto(): CreateTurnoServiceDto {
    return new CreateTurnoServiceDto(
      this.parseLocalDate(this.fecha),
      this.horaInicio,
      this.proveedorId,
      this.servicioId,
      this.cliente.toServiceDto(),
      this.notas,
    );
  }

  private parseLocalDate(date: string): Date {
    return new Date(date + 'T00:00:00');
  }
}
