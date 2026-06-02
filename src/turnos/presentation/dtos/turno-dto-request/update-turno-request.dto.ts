import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { UpdateTurnoServiceDto } from '../../../services/dto/update-turno-service.dto.js';

export class UpdateTurnoRequestDto {
  @IsOptional()
  @IsDateString()
  private readonly fecha?: string;

  @IsOptional()
  @IsString()
  private readonly horaInicio?: string;

  @IsOptional()
  @IsIn(['pendiente', 'confirmado', 'cancelado', 'completado'])
  private readonly estado?: string;

  @IsOptional()
  @IsString()
  private readonly notas?: string;

  constructor(fecha?: string, horaInicio?: string, estado?: string, notas?: string) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.estado = estado;
    this.notas = notas;
  }

  getFecha(): string | undefined {
    return this.fecha;
  }

  getHoraInicio(): string | undefined {
    return this.horaInicio;
  }

  getEstado(): string | undefined {
    return this.estado;
  }

  getNotas(): string | undefined {
    return this.notas;
  }

  toServiceDto(): UpdateTurnoServiceDto {
    return new UpdateTurnoServiceDto(
      this.fecha ? this.parseLocalDate(this.fecha) : undefined,
      this.horaInicio,
      this.estado,
      this.notas,
    );
  }

  private parseLocalDate(date: string): Date {
    return new Date(date + 'T00:00:00');
  }
}
