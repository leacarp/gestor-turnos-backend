import { Expose } from 'class-transformer';
import { TurnoEntity } from '../../../domain/entities/turno.entity.js';

export class TurnoResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly fecha: Date;

  @Expose()
  readonly horaInicio: string;

  @Expose()
  readonly estado: string;

  @Expose()
  readonly notas?: string;

  @Expose()
  readonly proveedorId: string;

  @Expose()
  readonly servicioId: string;

  @Expose()
  readonly clienteId: string;

  @Expose()
  readonly pagoId?: string;

  @Expose()
  readonly createdAt: Date;

  constructor(
    id: string,
    fecha: Date,
    horaInicio: string,
    estado: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    createdAt: Date,
    notas?: string,
    pagoId?: string,
  ) {
    this.id = id;
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.estado = estado;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.clienteId = clienteId;
    this.createdAt = createdAt;
    this.notas = notas;
    this.pagoId = pagoId;
  }

  static fromEntity(entity: TurnoEntity): TurnoResponseDto {
    return new TurnoResponseDto(
      entity.getId()!,
      entity.getFecha(),
      entity.getHoraInicio(),
      entity.getEstado(),
      entity.getProveedorId(),
      entity.getServicioId(),
      entity.getCliente().getId() ?? 'ID Desconocido',
      entity.getCreatedAt()!,
      entity.getNotas(),
      entity.getPagoId(),
    );
  }
}
