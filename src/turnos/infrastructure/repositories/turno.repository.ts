import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { ITurnoRepository } from '../../domain/interfaces/turno-repository.interface.js';
import { TurnoEntity } from '../../domain/entities/turno.entity.js';
import { Turno, TurnoDocument } from '../schemas/turno.schema.js';

@Injectable()
export class TurnoRepository implements ITurnoRepository {

  constructor(
    @InjectModel(Turno.name)
    private readonly turnoModel: Model<TurnoDocument>,
  ) {}

  async create(entity: TurnoEntity): Promise<TurnoEntity> {
    const turno = new this.turnoModel({
      fecha: entity.getFecha(),
      horaInicio: entity.getHoraInicio(),
      estado: entity.getEstado(),
      notas: entity.getNotas(),
      proveedorId: new Types.ObjectId(entity.getProveedorId()),
      servicioId: new Types.ObjectId(entity.getServicioId()),
      clienteId: new Types.ObjectId(entity.getClienteId()),
    });

    const saved = await turno.save();

    return this.toEntity(saved);
  }

  async findById(id: string): Promise<TurnoEntity | null> {
    const turno = await this.turnoModel.findById(id);

    if (!turno) {
      return null;
    }

    return this.toEntity(turno);
  }

  async findAll(): Promise<TurnoEntity[]> {
    const turnos = await this.turnoModel.find();

    return turnos.map((t) => this.toEntity(t));
  }

  async findByProveedor(proveedorId: string): Promise<TurnoEntity[]> {
    const turnos = await this.turnoModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
    });

    return turnos.map((t) => this.toEntity(t));
  }

  async findByCliente(clienteId: string): Promise<TurnoEntity[]> {
    const turnos = await this.turnoModel.find({
      clienteId: new Types.ObjectId(clienteId),
    });

    return turnos.map((t) => this.toEntity(t));
  }

  async findByProveedorAndDate(proveedorId: string, fecha: Date): Promise<TurnoEntity[]> {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    const turnos = await this.turnoModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
      fecha: { $gte: startOfDay, $lte: endOfDay },
      estado: { $in: ['pendiente', 'confirmado'] },
    });

    return turnos.map((t) => this.toEntity(t));
  }

  async update(
    id: string,
    data: { fecha?: Date; horaInicio?: string; estado?: string; notas?: string },
  ): Promise<TurnoEntity | null> {
    const updateData: Record<string, unknown> = {};

    if (data.fecha !== undefined) updateData.fecha = data.fecha;
    if (data.horaInicio !== undefined) updateData.horaInicio = data.horaInicio;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.notas !== undefined) updateData.notas = data.notas;

    const updated = await this.turnoModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updated) {
      return null;
    }

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.turnoModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Turno no encontrado');
    }
  }

  private toEntity(doc: TurnoDocument): TurnoEntity {
    return new TurnoEntity(
      doc.fecha,
      doc.horaInicio,
      doc.estado,
      doc.proveedorId.toString(),
      doc.servicioId.toString(),
      doc.clienteId.toString(),
      doc.notas,
      doc.pagoId?.toString(),
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString(),
    );
  }
}
