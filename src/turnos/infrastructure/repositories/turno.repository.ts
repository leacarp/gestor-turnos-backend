import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { ITurnoRepository } from '../../domain/interfaces/turno-repository.interface.js';
import { TurnoEntity } from '../../domain/entities/turno.entity.js';
import { ClienteEntity } from '../../domain/entities/cliente.entity.js';
import { Turno, TurnoDocument } from '../schemas/turno.schema.js';

@Injectable()
export class TurnoRepository implements ITurnoRepository {

  constructor(
    @InjectModel(Turno.name)
    private readonly turnoModel: Model<TurnoDocument>,
  ) {}

  async create(entity: TurnoEntity): Promise<TurnoEntity> {
    const cliente = entity.getCliente();

    const turnoData: any = {
      fecha: entity.getFecha(),
      horaInicio: entity.getHoraInicio(),
      estado: entity.getEstado(),
      notas: entity.getNotas(),
      proveedorId: new Types.ObjectId(entity.getProveedorId()),
      servicioId: new Types.ObjectId(entity.getServicioId()),
      tipoCliente: cliente.getTipo()
    };

    if (cliente.getTipo() === 'REGISTRADO') {
      turnoData.clienteId = new Types.ObjectId(cliente.getId());
    } else {
      turnoData.clienteNombre = cliente.getNombre();
      turnoData.clienteEmail = cliente.getEmail();
      turnoData.clienteCelular = cliente.getCelular();
    }

    const turno = new this.turnoModel(turnoData);
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
    // Build the range using the date components to avoid timezone drift.
    // fecha is always expected to be a local-midnight Date (created via new Date("YYYY-MM-DDT00:00:00")).
    const y = fecha.getFullYear();
    const m = fecha.getMonth();
    const d = fecha.getDate();

    const startOfDay = new Date(y, m, d, 0, 0, 0, 0);
    const endOfDay   = new Date(y, m, d, 23, 59, 59, 999);

    const turnos = await this.turnoModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
      fecha: { $gte: startOfDay, $lte: endOfDay },
      estado: { $in: ['pendiente', 'confirmado'] },
    });

    return turnos.map((t) => this.toEntity(t));
  }

  async findByProveedorAndDiaTodos(proveedorId: string, fecha: Date): Promise<TurnoEntity[]> {
    const y = fecha.getFullYear();
    const m = fecha.getMonth();
    const d = fecha.getDate();

    const startOfDay = new Date(y, m, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999);

    const turnos = await this.turnoModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
      fecha: { $gte: startOfDay, $lte: endOfDay },
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

  async findPendientesRecordatorio(
    ventanaInicio: Date,
    ventanaFin: Date,
    campoFlag: 'recordatorio12hEnviado' | 'recordatorio3hEnviado',
  ): Promise<TurnoEntity[]> {
    // Traemos candidatos por rango de día (Mongo no puede combinar fecha + horaInicio en una sola query)
    // y filtramos la ventana exacta fecha+hora en memoria.
    const diaInicio = new Date(ventanaInicio.getFullYear(), ventanaInicio.getMonth(), ventanaInicio.getDate());
    const diaFin = new Date(ventanaFin.getFullYear(), ventanaFin.getMonth(), ventanaFin.getDate(), 23, 59, 59, 999);

    const candidatos = await this.turnoModel.find({
      // Los turnos nacen en 'pendiente' y solo pasan a 'confirmado' si el proveedor
      // los toca a mano, así que filtrar por 'confirmado' dejaba esto siempre vacío.
      estado: { $in: ['pendiente', 'confirmado'] },
      [campoFlag]: false,
      fecha: { $gte: diaInicio, $lte: diaFin },
    });

    const enVentana = candidatos.filter((doc) => {
      const [h, m] = doc.horaInicio.split(':').map(Number);
      const fechaHora = new Date(doc.fecha.getFullYear(), doc.fecha.getMonth(), doc.fecha.getDate(), h, m, 0, 0);
      return fechaHora >= ventanaInicio && fechaHora <= ventanaFin;
    });

    return enVentana.map((t) => this.toEntity(t));
  }

  async marcarRecordatorioEnviado(
    id: string,
    campoFlag: 'recordatorio12hEnviado' | 'recordatorio3hEnviado',
  ): Promise<void> {
    const result = await this.turnoModel.findByIdAndUpdate(id, { [campoFlag]: true });

    if (!result) {
      throw new NotFoundException('Turno no encontrado');
    }
  }

  async cancelarTurnosDelDia(proveedorId: string, fecha: Date): Promise<TurnoEntity[]> {
    const y = fecha.getFullYear();
    const m = fecha.getMonth();
    const d = fecha.getDate();

    const startOfDay = new Date(y, m, d, 0, 0, 0, 0);
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999);

    const turnos = await this.turnoModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
      fecha: { $gte: startOfDay, $lte: endOfDay },
      estado: { $in: ['pendiente', 'confirmado'] },
    });

    await this.turnoModel.updateMany(
      { _id: { $in: turnos.map((t) => t._id) } },
      { estado: 'cancelado' },
    );

    return turnos.map((t) => {
      t.estado = 'cancelado';
      return this.toEntity(t);
    });
  }

  private toEntity(doc: TurnoDocument): TurnoEntity {

  let cliente: ClienteEntity;

  if (doc.tipoCliente === 'REGISTRADO') {
    cliente = ClienteEntity.createRegistered(doc.clienteId.toString());
  } else {
    cliente = ClienteEntity.createGuest(
      doc.clienteNombre!, 
      doc.clienteEmail!, 
      doc.clienteCelular!
    );
  }
    return new TurnoEntity({
      fecha: doc.fecha,
      horaInicio: doc.horaInicio,
      estado: doc.estado,
      proveedorId: doc.proveedorId.toString(),
      servicioId: doc.servicioId.toString(),
      cliente: cliente,
      notas: doc.notas,
      pagoId: doc.pagoId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      id: doc._id.toString(),
      recordatorio12hEnviado: doc.recordatorio12hEnviado,
      recordatorio3hEnviado: doc.recordatorio3hEnviado,
  });
  }
}
