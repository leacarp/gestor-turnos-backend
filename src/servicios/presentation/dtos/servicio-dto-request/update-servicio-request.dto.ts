import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { UpdateServicioServiceDto } from '../../../services/dto/update-servicio-service.dto.js';

export class UpdateServicioRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'La duración debe ser mayor a 0' })
  @Min(1, { message: 'La duración mínima es 1 minuto' })
  duracion?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La categoría no puede estar vacía' })
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  requiereSeña?: boolean;

  @IsOptional()
  @IsNumber()
  porcentajeSeña?: number;

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

  getCategoria(): string | undefined {
    return this.categoria;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  toServiceDto(): UpdateServicioServiceDto {
    return new UpdateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
      this.requiereSeña,
      this.porcentajeSeña,
      this.categoria,
      this.description,
    );
  }
}
