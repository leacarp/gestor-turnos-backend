import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { CreateServicioServiceDto } from '../../../services/dto/create-servicio-service.dto.js';

export class CreateServicioRequestDto {
  @IsString()
  @IsNotEmpty()
  private readonly nombre: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  private readonly duracion: number;

  @IsNumber()
  @IsPositive()
  private readonly precio: number;

  constructor(nombre: string, duracion: number, precio: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
  }

  getNombre(): string {
    return this.nombre;
  }

  getDuracion(): number {
    return this.duracion;
  }

  getPrecio(): number {
    return this.precio;
  }

  toServiceDto(): CreateServicioServiceDto {
    return new CreateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
    );
  }
}
