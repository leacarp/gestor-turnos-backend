import { ServicioEntity } from '../../domain/entities/servicio.entity.js';

export class CreateServicioServiceDto {
  private readonly nombre: string;
  private readonly duracion: number;
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

  toEntity(proveedorId: string): ServicioEntity {
    return new ServicioEntity(
      this.nombre,
      this.duracion,
      this.precio,
      proveedorId,
    );
  }
}
