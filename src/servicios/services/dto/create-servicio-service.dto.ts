import { ServicioEntity } from '../../domain/entities/servicio.entity.js';

export class CreateServicioServiceDto {
  private readonly nombre: string;
  private readonly duracion: number;
  private readonly precio: number;
  private readonly requiereSeña: boolean;
  private readonly montoSeña: number;
  private readonly categoria: string;
  private readonly description: string;

  constructor(nombre: string, duracion: number, precio: number, categoria : string, description: string, requiereSeña?: boolean, montoSeña?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.categoria = categoria;
    this.description = description;
    this.requiereSeña = requiereSeña ?? false;
    this.montoSeña = montoSeña ?? 0;
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

  getMontoSeña(): number {
    return this.montoSeña;
  }

  getCategoria() : string{
    return this.categoria;
  }

  getDescription(): string {
    return this.description;
  }

  toEntity(proveedorId: string): ServicioEntity {
    return new ServicioEntity(
      this.nombre,
      this.duracion,
      this.precio,
      proveedorId,
      this.requiereSeña,
      this.montoSeña,
      this.categoria,
      this.description,
    );
  }
}
