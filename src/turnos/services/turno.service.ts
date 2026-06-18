import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import type { ITurnoService } from '../domain/interfaces/turno-service.interface.js';
import type { ITurnoRepository } from '../domain/interfaces/turno-repository.interface.js';
import type { IUserAdapter } from '../domain/interfaces/user-adapter.interface.js';
import type { IServicioAdapter } from '../domain/interfaces/servicio-adapter.interface.js';
import { TurnoEntity } from '../domain/entities/turno.entity.js';
import {
  TURNO_REPOSITORY,
  TURNO_USER_ADAPTER,
  TURNO_SERVICIO_ADAPTER,
} from '../infrastructure/constants/injection-tokens.js';
import { CreateTurnoGuestServiceDto } from './dto/create-turno-guest-service.dto.js';
import { CreateTurnoServiceDto } from './dto/create-turno-service.dto.js';
import { Turno } from '../infrastructure/schemas/turno.schema.js';

@Injectable()
export class TurnoService implements ITurnoService {

  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
    @Inject(TURNO_USER_ADAPTER)
    private readonly userAdapter: IUserAdapter,
    @Inject(TURNO_SERVICIO_ADAPTER)
    private readonly servicioAdapter: IServicioAdapter,
  ) {}

  async create(dto: CreateTurnoServiceDto, userId: string): Promise<TurnoEntity> {

    const proveedorId = dto.getProveedorId();
    const servicioId = dto.getServicioId();
    const clienteId = dto.getCliente().getId() ?? 'ID desconocido';
    await this.validateProvider(proveedorId);
    await this.validateClient(clienteId);
    await this.validateServicio(servicioId, proveedorId);

    const necesitaSeña = await this.servicioAdapter.requiereSeña(servicioId);

    if (necesitaSeña) {
      throw new BadRequestException(
        'Este servicio requiere el pago de una seña. Usá POST /api/mercadopago/preference para iniciar el proceso de pago.',
      );
    }
    
    const turno = TurnoEntity.createForRegistered(dto, userId);
    return await this.turnoRepository.create(turno);
  }

  async createTurnoGuest(dto: CreateTurnoGuestServiceDto): Promise<TurnoEntity> {
    const proveedorId = dto.getProveedorId();
    const servicioId = dto.getServicioId();
    await this.validateProvider(proveedorId);
    await this.validateServicio(servicioId, proveedorId);

    const necesitaSeña = await this.servicioAdapter.requiereSeña(servicioId);

    if (necesitaSeña) {
      throw new BadRequestException(
        'Este servicio requiere el pago de una seña. Usá POST /api/mercadopago/preference para iniciar el proceso de pago.',
      );
    }
    
    const turno = TurnoEntity.createForGuest(dto);
    return await this.turnoRepository.create(turno);
  }

  async createFromPago(dto: CreateTurnoServiceDto): Promise<TurnoEntity> {

    const turno = TurnoEntity.createForRegistered(dto, dto.getCliente().getId() || 'ID desconocido');
    return this.turnoRepository.create(turno);
  }

  async findById(id: string): Promise<TurnoEntity> {
    const turno = await this.turnoRepository.findById(id);

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    return turno;
  }

  async findAll(): Promise<TurnoEntity[]> {
    return this.turnoRepository.findAll();
  }

  async findByProveedor(proveedorId: string): Promise<TurnoEntity[]> {
    return this.turnoRepository.findByProveedor(proveedorId);
  }

  async findByProveedorAndDate(proveedorId: string, fecha: Date): Promise<TurnoEntity[]> {
    return this.turnoRepository.findByProveedorAndDate(proveedorId, fecha);
  }

  async findByCliente(clienteId: string): Promise<TurnoEntity[]> {
    return this.turnoRepository.findByCliente(clienteId);
  }

  async update(
    id: string,
    data: { fecha?: Date; horaInicio?: string; estado?: string; notas?: string },
    userId: string,
    userRole: string,
  ): Promise<TurnoEntity> {
    const turno = await this.findById(id);

    this.validateParticipant(turno, userId, userRole);

    const updated = await this.turnoRepository.update(id, data);

    if (!updated) {
      throw new NotFoundException('Turno no encontrado');
    }

    return updated;
  }

  async delete(id: string, userId: string, userRole: string): Promise<void> {
    const turno = await this.findById(id);

    this.validateParticipant(turno, userId, userRole);

    await this.turnoRepository.delete(id);
  }

  private async validateProvider(proveedorId: string): Promise<void> {
    const exists = await this.userAdapter.existsProvider(proveedorId);

    if (!exists) {
      throw new BadRequestException('El proveedor indicado no existe o no tiene rol de proveedor');
    }
  }

  private async validateClient(clienteId: string): Promise<void> {
    const exists = await this.userAdapter.existsClient(clienteId);

    if (!exists) {
      throw new BadRequestException('El cliente indicado no existe o no tiene rol de cliente');
    }
  }

  private async validateServicio(servicioId: string, proveedorId: string): Promise<void> {
    const exists = await this.servicioAdapter.exists(servicioId);

    if (!exists) {
      throw new BadRequestException('El servicio indicado no existe');
    }

    const belongs = await this.servicioAdapter.belongsToProvider(servicioId, proveedorId);

    if (!belongs) {
      throw new BadRequestException('El servicio no pertenece al proveedor indicado');
    }
  }

  private validateParticipant(turno: TurnoEntity, userId: string, userRole: string): void {
    if (userRole === 'admin') return;

    const isProvider = turno.getProveedorId() === userId;
    const isClient = turno.getCliente().getId() === userId;

    if (!isProvider && !isClient) {
      throw new ForbiddenException('No tenés permisos para modificar este turno');
    }
  }

}
