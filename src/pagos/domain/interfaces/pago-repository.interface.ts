import { PagoEntity } from '../entities/pago.entity.js';

export interface IPagoRepository {
  create(entity: PagoEntity): Promise<PagoEntity>;
  findById(id: string): Promise<PagoEntity | null>;
  findByMpPaymentId(mpPaymentId: string): Promise<PagoEntity | null>;
  findByExternalReference(externalReference: string): Promise<PagoEntity | null>;
  findByProveedor(proveedorId: string): Promise<PagoEntity[]>;
  findByCliente(clienteId: string): Promise<PagoEntity[]>;
}
