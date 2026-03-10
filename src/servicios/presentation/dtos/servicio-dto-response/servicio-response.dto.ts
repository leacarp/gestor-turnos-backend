import { Expose } from 'class-transformer';
import { ServicioEntity } from '../../../domain/entities/servicio.entity.js';

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

  static fromEntity(entity: ServicioEntity): ServicioResponseDto {
    return new ServicioResponseDto(
      entity.getId()!,
      entity.getNombre(),
      entity.getDuracion(),
      entity.getPrecio(),
      entity.getProveedorId(),
      entity.getCreatedAt()!,
    );
  }
}
