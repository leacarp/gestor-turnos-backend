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
  readonly requiereSeña: boolean;

  @Expose()
  readonly porcentajeSeña: number;

  @Expose()
  readonly montoSeña: number;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly categoria : string;

  @Expose()
  readonly description: string;

  constructor(
    id: string,
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    requiereSeña: boolean,
    porcentajeSeña: number,
    categoria: string,
    montoSeña: number,
    createdAt: Date,
    description: string,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.proveedorId = proveedorId;
    this.requiereSeña = requiereSeña;
    this.porcentajeSeña = porcentajeSeña;
    this.montoSeña = montoSeña;
    this.createdAt = createdAt;
    this.categoria = categoria;
    this.description = description;
  }

  static fromEntity(entity: ServicioEntity): ServicioResponseDto {
    return new ServicioResponseDto(
      entity.getId()!,
      entity.getNombre(),
      entity.getDuracion(),
      entity.getPrecio(),
      entity.getProveedorId(),
      entity.getRequiereSeña(),
      entity.getPorcentajeSeña(),
      entity.getCategoria(),
      entity.calcularMontoSeña(),
      entity.getCreatedAt()!,
      entity.getDescription(),
    );
  }
}
