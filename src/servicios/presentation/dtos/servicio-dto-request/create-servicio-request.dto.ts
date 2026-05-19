import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, IsBoolean, IsOptional, Max } from 'class-validator';
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

  @IsOptional()
  @IsBoolean()
  private readonly requiereSeña?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  private readonly porcentajeSeña?: number;

  constructor(nombre: string, duracion: number, precio: number, requiereSeña?: boolean, porcentajeSeña?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.requiereSeña = requiereSeña;
    this.porcentajeSeña = porcentajeSeña;
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

  getRequiereSeña(): boolean | undefined {
    return this.requiereSeña;
  }

  getPorcentajeSeña(): number | undefined {
    return this.porcentajeSeña;
  }

  toServiceDto(): CreateServicioServiceDto {
    return new CreateServicioServiceDto(
      this.nombre,
      this.duracion,
      this.precio,
      this.requiereSeña,
      this.porcentajeSeña,
    );
  }
}
