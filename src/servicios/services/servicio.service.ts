import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import type { IServicioService } from '../domain/interfaces/servicio-service.interface.js';
import type { IServicioRepository } from '../domain/interfaces/servicio-repository.interface.js';
import type { IProviderAdapter } from '../domain/interfaces/provider-adapter.interface.js';
import {
  SERVICIO_REPOSITORY,
  SERVICIO_PROVIDER_ADAPTER,
} from '../infrastructure/constants/injection-tokens.js';

import { CreateServicioRequestDto } from '../presentation/dtos/servicio-dto-request/create-servicio-request.dto.js';
import { UpdateServicioRequestDto } from '../presentation/dtos/servicio-dto-request/update-servicio-request.dto.js';
import { ServicioResponseDto } from '../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

@Injectable()
export class ServicioService implements IServicioService {

  constructor(
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: IServicioRepository,
    @Inject(SERVICIO_PROVIDER_ADAPTER)
    private readonly providerAdapter: IProviderAdapter,
  ) {}

  async create(
    dto: CreateServicioRequestDto,
    proveedorId: string,
  ): Promise<ServicioResponseDto> {
    await this.validateProvider(proveedorId);

    return this.servicioRepository.create({
      nombre: dto.getNombre(),
      duracion: dto.getDuracion(),
      precio: dto.getPrecio(),
      proveedorId,
    });
  }

  async findById(id: string): Promise<ServicioResponseDto> {
    const servicio = await this.servicioRepository.findById(id);

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return servicio;
  }

  async findAll(): Promise<ServicioResponseDto[]> {
    return this.servicioRepository.findAll();
  }

  async findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]> {
    return this.servicioRepository.findByProveedor(proveedorId);
  }

  async update(
    id: string,
    dto: UpdateServicioRequestDto,
    proveedorId: string,
  ): Promise<ServicioResponseDto> {
    const servicio = await this.findById(id);

    this.validateOwnership(servicio, proveedorId);

    const updated = await this.servicioRepository.update(id, {
      nombre: dto.getNombre(),
      duracion: dto.getDuracion(),
      precio: dto.getPrecio(),
    });

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
    servicio: ServicioResponseDto,
    proveedorId: string,
  ): void {
    if (servicio.proveedorId !== proveedorId) {
      throw new ForbiddenException('No podés modificar un servicio que no te pertenece');
    }
  }
}
