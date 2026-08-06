import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import type { IServicioService } from '../domain/interfaces/servicio-service.interface.js';
import type { IServicioRepository } from '../domain/interfaces/servicio-repository.interface.js';
import type { IProviderAdapter } from '../domain/interfaces/provider-adapter.interface.js';
import { ServicioEntity } from '../domain/entities/servicio.entity.js';
import {
  SERVICIO_REPOSITORY,
  SERVICIO_PROVIDER_ADAPTER,
} from '../infrastructure/constants/injection-tokens.js';

@Injectable()
export class ServicioService implements IServicioService {

  constructor(
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: IServicioRepository,
    @Inject(SERVICIO_PROVIDER_ADAPTER)
    private readonly providerAdapter: IProviderAdapter,
  ) {}

  async create(
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    categoria: string,
    description: string,
    requiereSeña: boolean = false,
    montoSeña: number = 0,
  ): Promise<ServicioEntity> {
    await this.validateProvider(proveedorId);
    this.validateCreateFields(nombre, description, duracion, precio, categoria);

    if (requiereSeña) {
      if (montoSeña <= 0) {
        throw new BadRequestException('La seña debe ser mayor a 0');
      }
      if (montoSeña > precio) {
        throw new BadRequestException('La seña no puede ser mayor al precio del servicio');
      }
    } else {
      montoSeña = 0;
    }

    const entity = new ServicioEntity(nombre, duracion, precio, proveedorId, requiereSeña, montoSeña, categoria, description);

    return this.servicioRepository.create(entity);
  }

  async findById(id: string): Promise<ServicioEntity> {
    const servicio = await this.servicioRepository.findById(id);

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return servicio;
  }

  async findAll(): Promise<ServicioEntity[]> {
    return this.servicioRepository.findAll();
  }

  async findByProveedor(proveedorId: string): Promise<ServicioEntity[]> {
    return this.servicioRepository.findByProveedor(proveedorId);
  }

  async update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number; categoria?: string; description?: string; requiereSeña?: boolean; montoSeña?: number },
    proveedorId: string,
  ): Promise<ServicioEntity> {
    const servicio = await this.findById(id);

    this.validateOwnership(servicio, proveedorId);
    this.validateUpdateFields(data);

    const requiereSeña = data.requiereSeña ?? servicio.getRequiereSeña();
    const montoSeña = data.montoSeña ?? servicio.getMontoSeña();
    const precio = data.precio !== undefined ? data.precio : servicio.getPrecio();

    if (requiereSeña) {
      if (montoSeña <= 0) {
        throw new BadRequestException('La seña debe ser mayor a 0');
      }
      if (montoSeña > precio) {
        throw new BadRequestException('La seña no puede ser mayor al precio del servicio');
      }
    }

    const updated = await this.servicioRepository.update(id, data);

    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return updated;
  }

  async delete(id: string, proveedorId: string): Promise<void> {
    const servicio = await this.findById(id);

    this.validateOwnership(servicio, proveedorId);

    await this.servicioRepository.delete(id);
  }

  private async validateProvider(proveedorId: string) {
    const provider = await this.providerAdapter.findById(proveedorId);

    if (!provider || provider.role !== 'provider') {
      throw new ForbiddenException('Solo los proveedores pueden crear servicios');
    }

    return provider;
  }

  private validateOwnership(
    servicio: ServicioEntity,
    proveedorId: string,
  ): void {
    if (servicio.getProveedorId() !== proveedorId) {
      throw new ForbiddenException('No podés modificar un servicio que no te pertenece');
    }
  }

  private validateCreateFields(
    nombre: string,
    description: string,
    duracion: number,
    precio: number,
    categoria: string,
  ): void {
    if (!nombre?.trim()) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    if (!description?.trim()) {
      throw new BadRequestException('La descripción es obligatoria');
    }
    if (!categoria?.trim()) {
      throw new BadRequestException('La categoría es obligatoria');
    }
    if (!Number.isFinite(duracion) || duracion < 1) {
      throw new BadRequestException('La duración debe ser al menos 1 minuto');
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      throw new BadRequestException('El precio debe ser mayor a 0');
    }
  }

  private validateUpdateFields(data: {
    nombre?: string;
    duracion?: number;
    precio?: number;
    categoria?: string;
    description?: string;
    requiereSeña?: boolean;
    montoSeña?: number;
  }): void {
    const hasField =
      data.nombre !== undefined ||
      data.description !== undefined ||
      data.duracion !== undefined ||
      data.precio !== undefined ||
      data.categoria !== undefined ||
      data.requiereSeña !== undefined ||
      data.montoSeña !== undefined;

    if (!hasField) {
      throw new BadRequestException('Debe enviar al menos un campo para actualizar');
    }
    if (data.nombre !== undefined && !data.nombre.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }
    if (data.description !== undefined && !data.description.trim()) {
      throw new BadRequestException('La descripción no puede estar vacía');
    }
    if (data.categoria !== undefined && !data.categoria.trim()) {
      throw new BadRequestException('La categoría no puede estar vacía');
    }
    if (data.duracion !== undefined && (!Number.isFinite(data.duracion) || data.duracion < 1)) {
      throw new BadRequestException('La duración debe ser al menos 1 minuto');
    }
    if (data.precio !== undefined && (!Number.isFinite(data.precio) || data.precio <= 0)) {
      throw new BadRequestException('El precio debe ser mayor a 0');
    }
  }
}
