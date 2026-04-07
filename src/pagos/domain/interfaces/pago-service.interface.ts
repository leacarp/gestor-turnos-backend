import { PagoEntity } from '../entities/pago.entity.js';

export interface ICreatePagoData {
  monto: number;
  montoTotal: number;
  porcentajeSeña: number;
  mpPaymentId: string;
  mpStatus: string;
  mpStatusDetail: string;
  mpExternalReference: string;
  proveedorId: string;
  clienteId: string;
  servicioId: string;
}

export interface IPagoService {
  create(data: ICreatePagoData): Promise<PagoEntity>;
  findById(id: string): Promise<PagoEntity>;
  findByMpPaymentId(mpPaymentId: string): Promise<PagoEntity | null>;
  findByExternalReference(externalReference: string): Promise<PagoEntity | null>;
  findByProveedor(proveedorId: string): Promise<PagoEntity[]>;
  findByCliente(clienteId: string): Promise<PagoEntity[]>;
}
