import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { IPagoRepository } from '../../domain/interfaces/pago-repository.interface.js';
import { PagoEntity, EstadoPago } from '../../domain/entities/pago.entity.js';
import { Pago, PagoDocument } from '../schemas/pago.schema.js';

@Injectable()
export class PagoRepository implements IPagoRepository {

  constructor(
    @InjectModel(Pago.name)
    private readonly pagoModel: Model<PagoDocument>,
  ) {}

  async create(entity: PagoEntity): Promise<PagoEntity> {
    const pago = new this.pagoModel({
      monto: entity.getMonto(),
      montoTotal: entity.getMontoTotal(),
      porcentajeSeña: entity.getPorcentajeSeña(),
      estado: entity.getEstado(),
      mpPaymentId: entity.getMpPaymentId(),
      mpStatus: entity.getMpStatus(),
      mpStatusDetail: entity.getMpStatusDetail(),
      mpExternalReference: entity.getMpExternalReference(),
      proveedorId: new Types.ObjectId(entity.getProveedorId()),
      servicioId: new Types.ObjectId(entity.getServicioId()),
      clienteId: entity.getClienteId() ? new Types.ObjectId(entity.getClienteId()) : undefined,
      guestEmail: entity.getGuestEmail(),
    });

    const saved = await pago.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<PagoEntity | null> {
    const pago = await this.pagoModel.findById(id);
    return pago ? this.toEntity(pago) : null;
  }

  async findByMpPaymentId(mpPaymentId: string): Promise<PagoEntity | null> {
    const pago = await this.pagoModel.findOne({ mpPaymentId });
    return pago ? this.toEntity(pago) : null;
  }

  async findByExternalReference(externalReference: string): Promise<PagoEntity | null> {
    const pago = await this.pagoModel.findOne({ mpExternalReference: externalReference });
    return pago ? this.toEntity(pago) : null;
  }

  async findByProveedor(proveedorId: string): Promise<PagoEntity[]> {
    const pagos = await this.pagoModel.find({ proveedorId: new Types.ObjectId(proveedorId) });
    return pagos.map((p) => this.toEntity(p));
  }

  async findByCliente(clienteId: string): Promise<PagoEntity[]> {
    const pagos = await this.pagoModel.find({ clienteId: new Types.ObjectId(clienteId) });
    return pagos.map((p) => this.toEntity(p));
  }

  private toEntity(doc: PagoDocument): PagoEntity {
    return new PagoEntity(
      doc.monto,
      doc.montoTotal,
      doc.porcentajeSeña,
      doc.estado as EstadoPago,
      doc.mpPaymentId,
      doc.mpStatus,
      doc.mpStatusDetail,
      doc.mpExternalReference,
      doc.proveedorId.toString(),
      doc.servicioId.toString(),
      doc.clienteId?.toString(),
      doc.guestEmail,
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString(),
    );
  }
}
