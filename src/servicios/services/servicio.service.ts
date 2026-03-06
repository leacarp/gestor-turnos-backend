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

import { CreateServicioServiceDto } from './dto/create-servicio-service.dto.js';
import { UpdateServicioServiceDto } from './dto/update-servicio-service.dto.js';
import { ServicioResponseDto } from '../presentation/dtos/servicio-dto-response/servicio-response.dto.js';
import type { ServicioInfrastructureDto } from '../infrastructure/dto/servicio-infrastructure.dto.js';

@Injectable()
export class ServicioService implements IServicioService {

  constructor(
    @Inject(SERVICIO_REPOSITORY)
    private readonly servicioRepository: IServicioRepository,
    @Inject(SERVICIO_PROVIDER_ADAPTER)
    private readonly providerAdapter: IProviderAdapter,
  ) {}

  async create(
    dto: CreateServicioServiceDto,
    proveedorId: string,
  ): Promise<ServicioResponseDto> {
    await this.validateProvider(proveedorId);

    const infraDto = dto.toInfrastructureDto(proveedorId);
    const saved = await this.servicioRepository.create(infraDto);

    return saved.toResponseDto();
  }

  async findById(id: string): Promise<ServicioResponseDto> {
    const servicio = await this.findInfraById(id);

    return servicio.toResponseDto();
  }

  async findAll(): Promise<ServicioResponseDto[]> {
    const servicios = await this.servicioRepository.findAll();

    return servicios.map((s) => s.toResponseDto());
  }

  async findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]> {
    const servicios = await this.servicioRepository.findByProveedor(proveedorId);

    return servicios.map((s) => s.toResponseDto());
  }

  async update(
    id: string,
    dto: UpdateServicioServiceDto,
    proveedorId: string,
  ): Promise<ServicioResponseDto> {
    const servicio = await this.findInfraById(id);

    this.validateOwnership(servicio, proveedorId);

    const updateData = dto.toInfrastructureUpdateData();
    const updated = await this.servicioRepository.update(id, updateData);

    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return updated.toResponseDto();
  }

  async delete(id: string, proveedorId: string): Promise<void> {
    const servicio = await this.findInfraById(id);

    this.validateOwnership(servicio, proveedorId);

    await this.servicioRepository.delete(id);
  }

  private async findInfraById(id: string): Promise<ServicioInfrastructureDto> {
    const servicio = await this.servicioRepository.findById(id);

    if (!servicio) {
      throw new NotFoundException('Servicio no encontrado');
    }

    return servicio;
  }

  private async validateProvider(proveedorId: string): Promise<void> {
    const isProvider = await this.providerAdapter.isProvider(proveedorId);

    if (!isProvider) {
      throw new ForbiddenException('Solo los proveedores pueden crear servicios');
    }
  }

  private validateOwnership(
    servicio: ServicioInfrastructureDto,
    proveedorId: string,
  ): void {
    if (servicio.getProveedorId() !== proveedorId) {
      throw new ForbiddenException('No podés modificar un servicio que no te pertenece');
    }
  }
}
