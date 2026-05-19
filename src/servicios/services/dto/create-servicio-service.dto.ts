import { ServicioEntity } from '../../domain/entities/servicio.entity.js';

export class CreateServicioServiceDto {
  private readonly nombre: string;
  private readonly duracion: number;
  private readonly precio: number;
  private readonly requiereSeña: boolean;
  private readonly porcentajeSeña: number;

  constructor(nombre: string, duracion: number, precio: number, requiereSeña?: boolean, porcentajeSeña?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.requiereSeña = requiereSeña ?? false;
    this.porcentajeSeña = porcentajeSeña ?? 0;
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

  getRequiereSeña(): boolean {
    return this.requiereSeña;
  }

  getPorcentajeSeña(): number {
    return this.porcentajeSeña;
  }

  toEntity(proveedorId: string): ServicioEntity {
    return new ServicioEntity(
      this.nombre,
      this.duracion,
      this.precio,
      proveedorId,
      this.requiereSeña,
      this.porcentajeSeña,
    );
  }
}
