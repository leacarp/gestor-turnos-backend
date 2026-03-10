import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
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
  ): Promise<ServicioEntity> {
    await this.validateProvider(proveedorId);

    const entity = new ServicioEntity(nombre, duracion, precio, proveedorId);

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
    data: { nombre?: string; duracion?: number; precio?: number },
    proveedorId: string,
  ): Promise<ServicioEntity> {
    const servicio = await this.findById(id);

    this.validateOwnership(servicio, proveedorId);

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

  private async validateProvider(proveedorId: string): Promise<void> {
    const isProvider = await this.providerAdapter.isProvider(proveedorId);

    if (!isProvider) {
      throw new ForbiddenException('Solo los proveedores pueden crear servicios');
    }
  }

  private validateOwnership(
    servicio: ServicioEntity,
    proveedorId: string,
  ): void {
    if (servicio.getProveedorId() !== proveedorId) {
      throw new ForbiddenException('No podés modificar un servicio que no te pertenece');
    }
  }
}
