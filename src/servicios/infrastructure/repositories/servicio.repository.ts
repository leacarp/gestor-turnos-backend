import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { IServicioRepository } from '../../domain/interfaces/servicio-repository.interface.js';
import { Servicio, ServicioDocument } from '../schemas/servicio.schema.js';
import { ServicioResponseDto } from '../../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

@Injectable()
export class ServicioRepository implements IServicioRepository {

  constructor(
    @InjectModel(Servicio.name)
    private readonly servicioModel: Model<ServicioDocument>,
  ) {}

  async create(data: {
    nombre: string;
    duracion: number;
    precio: number;
    proveedorId: string;
  }): Promise<ServicioResponseDto> {
    const servicio = new this.servicioModel({
      nombre: data.nombre,
      duracion: data.duracion,
      precio: data.precio,
      proveedorId: new Types.ObjectId(data.proveedorId),
    });

    const saved = await servicio.save();

    return this.toResponseDto(saved);
  }

  async findById(id: string): Promise<ServicioResponseDto | null> {
    const servicio = await this.servicioModel.findById(id);

    if (!servicio) {
      return null;
    }

    return this.toResponseDto(servicio);
  }

  async findAll(): Promise<ServicioResponseDto[]> {
    const servicios = await this.servicioModel.find();

    return servicios.map((s) => this.toResponseDto(s));
  }

  async findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]> {
    const servicios = await this.servicioModel.find({
      proveedorId: new Types.ObjectId(proveedorId),
    });

    return servicios.map((s) => this.toResponseDto(s));
  }

  async update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number },
  ): Promise<ServicioResponseDto | null> {
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

    return this.toResponseDto(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.servicioModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Servicio no encontrado');
    }
  }

  private toResponseDto(servicio: ServicioDocument): ServicioResponseDto {
    return new ServicioResponseDto(
      servicio._id.toString(),
      servicio.nombre,
      servicio.duracion,
      servicio.precio,
      servicio.proveedorId.toString(),
      servicio.createdAt!,
    );
  }
}
