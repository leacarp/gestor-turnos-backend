import { IsString, IsOptional, IsNumber, IsPositive, Min, IsBoolean, Max } from 'class-validator';
import { UpdateServicioServiceDto } from '../../../services/dto/update-servicio-service.dto.js';

export class UpdateServicioRequestDto {
  @IsOptional()
  @IsString()
  private readonly nombre?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  private readonly duracion?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  private readonly precio?: number;

  @IsOptional()
  @IsBoolean()
  private readonly requiereSeña?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  private readonly porcentajeSeña?: number;

  constructor(nombre?: string, duracion?: number, precio?: number, requiereSeña?: boolean, porcentajeSeña?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.requiereSeña = requiereSeña;
    this.porcentajeSeña = porcentajeSeña;
  }

  getNombre(): string | undefined {
    return this.nombre;
  }

  getDuracion(): number | undefined {
    return this.duracion;
  }

  getPrecio(): number | undefined {
    return this.precio;
  }

  getRequiereSeña(): boolean | undefined {
    return this.requiereSeña;
  }

  getPorcentajeSeña(): number | undefined {
    return this.porcentajeSeña;
  }

  toServiceDto(): UpdateServicioServiceDto {
    return new UpdateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
      this.requiereSeña,
      this.porcentajeSeña,
    );
  }
}
