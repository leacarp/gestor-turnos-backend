import { ServicioResponseDto } from '../../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

export class ServicioInfrastructureDto {
  private readonly id?: string;
  private readonly nombre: string;
  private readonly duracion: number;
  private readonly precio: number;
  private readonly proveedorId: string;
  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  constructor(
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.proveedorId = proveedorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.id = id;
  }

  getId(): string | undefined {
    return this.id;
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

  getProveedorId(): string {
    return this.proveedorId;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  toResponseDto(): ServicioResponseDto {
    return new ServicioResponseDto(
      this.id!,
      this.nombre,
      this.duracion,
      this.precio,
      this.proveedorId,
      this.createdAt!,
    );
  }
}
