import { IsString, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';
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

  constructor(nombre?: string, duracion?: number, precio?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
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

  toServiceDto(): UpdateServicioServiceDto {
    return new UpdateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
    );
  }
}
