import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CreateServicioServiceDto } from '../../../services/dto/create-servicio-service.dto.js';

export class CreateServicioRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsNumber()
  @IsPositive({ message: 'La duración debe ser mayor a 0' })
  @Min(1, { message: 'La duración mínima es 1 minuto' })
  duracion: number;

  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoria: string;

  @IsOptional()
  @IsBoolean()
  requiereSeña?: boolean;

  @IsOptional()
  @IsNumber()
  porcentajeSeña?: number;

  getNombre(): string {
    return this.nombre;
  }

  getDuracion(): number {
    return this.duracion;
  }

  getPrecio(): number {
    return this.precio;
  }

  getRequiereSeña(): boolean | undefined {
    return this.requiereSeña;
  }

  getPorcentajeSeña(): number | undefined {
    return this.porcentajeSeña;
  }

  getCategoria(): string {
    return this.categoria;
  }

  getDescription(): string {
    return this.description;
  }

  toServiceDto(): CreateServicioServiceDto {
    return new CreateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
      this.categoria,
      this.description,
      this.requiereSeña,
      this.porcentajeSeña,
    );
  }
}
