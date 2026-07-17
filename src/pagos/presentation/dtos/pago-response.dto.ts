import { Expose } from 'class-transformer';
import { PagoEntity } from '../../domain/entities/pago.entity.js';

export class PagoResponseDto {
  @Expose() readonly id: string;
  @Expose() readonly monto: number;
  @Expose() readonly montoTotal: number;
  @Expose() readonly porcentajeSeña: number;
  @Expose() readonly estado: string;
  @Expose() readonly mpPaymentId: string;
  @Expose() readonly mpStatus: string;
  @Expose() readonly mpStatusDetail: string;
  @Expose() readonly proveedorId: string;
  @Expose() readonly clienteId: string;
  @Expose() readonly servicioId: string;
  @Expose() readonly createdAt: Date;

  constructor(
    id: string,
    monto: number,
    montoTotal: number,
    porcentajeSeña: number,
    estado: string,
    mpPaymentId: string,
    mpStatus: string,
    mpStatusDetail: string,
    proveedorId: string,
    clienteId: string,
    servicioId: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.monto = monto;
    this.montoTotal = montoTotal;
    this.porcentajeSeña = porcentajeSeña;
    this.estado = estado;
    this.mpPaymentId = mpPaymentId;
    this.mpStatus = mpStatus;
    this.mpStatusDetail = mpStatusDetail;
    this.proveedorId = proveedorId;
    this.clienteId = clienteId;
    this.servicioId = servicioId;
    this.createdAt = createdAt;
  }

  static fromEntity(entity: PagoEntity): PagoResponseDto {
    return new PagoResponseDto(
      entity.getId()!,
      entity.getMonto(),
      entity.getMontoTotal(),
      entity.getPorcentajeSeña(),
      entity.getEstado(),
      entity.getMpPaymentId(),
      entity.getMpStatus(),
      entity.getMpStatusDetail(),
      entity.getProveedorId(),
      entity.getClienteId() || "ID Desconocido",
      entity.getServicioId(),
      entity.getCreatedAt()!,
    );
  }
}
