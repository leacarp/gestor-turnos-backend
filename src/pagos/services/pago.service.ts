import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPagoService, ICreatePagoData } from '../domain/interfaces/pago-service.interface.js';
import type { IPagoRepository } from '../domain/interfaces/pago-repository.interface.js';
import { PagoEntity } from '../domain/entities/pago.entity.js';
import { PAGO_REPOSITORY } from '../infrastructure/constants/injection-tokens.js';

@Injectable()
export class PagoService implements IPagoService {

  constructor(
    @Inject(PAGO_REPOSITORY)
    private readonly pagoRepository: IPagoRepository,
  ) {}

  async create(data: ICreatePagoData): Promise<PagoEntity> {
    const entity = new PagoEntity(
      data.monto,
      data.montoTotal,
      data.porcentajeSeña,
      'aprobado',
      data.mpPaymentId,
      data.mpStatus,
      data.mpStatusDetail,
      data.mpExternalReference,
      data.proveedorId,
      data.clienteId,
      data.servicioId,
    );

    return this.pagoRepository.create(entity);
  }

  async findById(id: string): Promise<PagoEntity> {
    const pago = await this.pagoRepository.findById(id);

    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }

    return pago;
  }

  async findByMpPaymentId(mpPaymentId: string): Promise<PagoEntity | null> {
    return this.pagoRepository.findByMpPaymentId(mpPaymentId);
  }

  async findByExternalReference(externalReference: string): Promise<PagoEntity | null> {
    return this.pagoRepository.findByExternalReference(externalReference);
  }

  async findByProveedor(proveedorId: string): Promise<PagoEntity[]> {
    return this.pagoRepository.findByProveedor(proveedorId);
  }

  async findByCliente(clienteId: string): Promise<PagoEntity[]> {
    return this.pagoRepository.findByCliente(clienteId);
  }
}
