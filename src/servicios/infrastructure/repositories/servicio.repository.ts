import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { IServicioRepository } from '../../domain/interfaces/servicio-repository.interface.js';
import { ServicioEntity } from '../../domain/entities/servicio.entity.js';
import { Servicio, ServicioDocument } from '../schemas/servicio.schema.js';

@Injectable()
export class ServicioRepository implements IServicioRepository {

  constructor(
    @InjectModel(Servicio.name)
    private readonly servicioModel: Model<ServicioDocument>,
  ) {}

  async create(entity: ServicioEntity): Promise<ServicioEntity> {
    const servicio = new this.servicioModel({
      nombre: entity.getNombre(),
      duracion: entity.getDuracion(),
      precio: entity.getPrecio(),
      proveedorId: new Types.ObjectId(entity.getProveedorId()),
      requiereSeña: entity.getRequiereSeña(),
      montoSeña: entity.getMontoSeña(),
      categoria: entity.getCategoria(),
      description: entity.getDescription(),
    });

    const saved = await servicio.save();

    return this.toEntity(saved);
  }

  async findById(id: string): Promise<ServicioEntity | null> {
    const servicio = await this.servicioModel.findById(id);

    if (!servicio) {
      return null;
    }

    return this.toEntity(servicio);
  }

  async findAll(): Promise<ServicioEntity[]> {
    const servicios = await this.servicioModel.find();

    return servicios.map((s) => this.toEntity(s));
  }

  async findByProveedor(proveedorId: string): Promise<ServicioEntity[]> {
    const servicios = await this.servicioModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
    });

    return servicios.map((s) => this.toEntity(s));
  }

  async update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number; requiereSeña?: boolean; porcentajeSeña?: number; categoria?: string; description?: string },
  ): Promise<ServicioEntity | null> {
    const updateData: Record<string, unknown> = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.duracion !== undefined) updateData.duracion = data.duracion;
    if (data.precio !== undefined) updateData.precio = data.precio;
    if (data.categoria !== undefined) updateData.categoria = data.categoria;
    if (data.description !== undefined) updateData.description = data.description;

    const updated = await this.servicioModel.findByIdAndUpdate(
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
    const result = await this.servicioModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Servicio no encontrado');
    }
  }

  private toEntity(doc: ServicioDocument): ServicioEntity {
    const legacyDoc = doc as ServicioDocument & { porcentajeSeña?: number };

    return new ServicioEntity(
      doc.nombre,
      doc.duracion,
      doc.precio,
      doc.proveedorId.toString(),
      doc.requiereSeña ?? false,
      doc.montoSeña ?? legacyDoc.porcentajeSeña ?? 0,
      doc.categoria,
      doc.description ?? '',
      doc.createdAt,
      doc.updatedAt,
      doc._id.toString(),
    );
  }
}
