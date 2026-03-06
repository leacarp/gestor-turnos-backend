import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { IServicioRepository } from '../../domain/interfaces/servicio-repository.interface.js';
import { Servicio, ServicioDocument } from '../schemas/servicio.schema.js';
import { ServicioInfrastructureDto } from '../dto/servicio-infrastructure.dto.js';

@Injectable()
export class ServicioRepository implements IServicioRepository {

  constructor(
    @InjectModel(Servicio.name)
    private readonly servicioModel: Model<ServicioDocument>,
  ) {}

  async create(dto: ServicioInfrastructureDto): Promise<ServicioInfrastructureDto> {
    const servicio = new this.servicioModel({
      nombre: dto.getNombre(),
      duracion: dto.getDuracion(),
      precio: dto.getPrecio(),
      proveedorId: new Types.ObjectId(dto.getProveedorId()),
    });

    const saved = await servicio.save();

    return this.toInfrastructureDto(saved);
  }

  async findById(id: string): Promise<ServicioInfrastructureDto | null> {
    const servicio = await this.servicioModel.findById(id);

    if (!servicio) {
      return null;
    }

    return this.toInfrastructureDto(servicio);
  }

  async findAll(): Promise<ServicioInfrastructureDto[]> {
    const servicios = await this.servicioModel.find();

    return servicios.map((s) => this.toInfrastructureDto(s));
  }

  async findByProveedor(proveedorId: string): Promise<ServicioInfrastructureDto[]> {
    const servicios = await this.servicioModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
    });

    return servicios.map((s) => this.toInfrastructureDto(s));
  }

  async update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number },
  ): Promise<ServicioInfrastructureDto | null> {
    const updateData: Record<string, unknown> = {};

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.duracion !== undefined) updateData.duracion = data.duracion;
    if (data.precio !== undefined) updateData.precio = data.precio;

    const updated = await this.servicioModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!updated) {
      return null;
    }

    return this.toInfrastructureDto(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.servicioModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Servicio no encontrado');
    }
  }

  private toInfrastructureDto(servicio: ServicioDocument): ServicioInfrastructureDto {
    return new ServicioInfrastructureDto(
      servicio.nombre,
      servicio.duracion,
      servicio.precio,
      servicio.proveedorId.toString(),
      servicio.createdAt!,
      servicio.updatedAt,
      servicio._id.toString(),
    );
  }
}
