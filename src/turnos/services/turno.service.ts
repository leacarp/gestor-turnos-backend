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

  async create(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    notas?: string,
  ): Promise<TurnoEntity> {
    await this.validateProvider(proveedorId);
    await this.validateClient(clienteId);
    await this.validateServicio(servicioId, proveedorId);

    const entity = new TurnoEntity(
      fecha,
      horaInicio,
      'pendiente',
      proveedorId,
      servicioId,
      clienteId,
      notas,
    );

    return this.turnoRepository.create(entity);
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
    const isClient = turno.getClienteId() === userId;

    if (!isProvider && !isClient) {
      throw new ForbiddenException('No tenés permisos para modificar este turno');
    }
  }
}
