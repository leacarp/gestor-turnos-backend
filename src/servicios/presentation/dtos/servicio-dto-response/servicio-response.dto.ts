import { Expose } from 'class-transformer';

export class ServicioResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly nombre: string;

  @Expose()
  readonly duracion: number;

  @Expose()
  readonly precio: number;

  @Expose()
  readonly proveedorId: string;

  @Expose()
  readonly createdAt: Date;

  constructor(
    id: string,
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.proveedorId = proveedorId;
    this.createdAt = createdAt;
  }
}
