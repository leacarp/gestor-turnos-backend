import { TurnoEntity } from '../entities/turno.entity.js';
import { CreateTurnoServiceDto } from 'src/turnos/services/dto/create-turno-service.dto.js';
import { CreateTurnoGuestServiceDto } from 'src/turnos/services/dto/create-turno-guest-service.dto.js';

export interface ITurnoService {
  create(dto: CreateTurnoServiceDto, userId: string): Promise<TurnoEntity>;

  createTurnoGuest(dto: CreateTurnoGuestServiceDto): Promise<TurnoEntity>;

  findById(id: string): Promise<TurnoEntity>;

  findAll(): Promise<TurnoEntity[]>;

  findByProveedor(proveedorId: string): Promise<TurnoEntity[]>;

  findByProveedorAndDate(proveedorId: string, fecha: Date): Promise<TurnoEntity[]>;

  findByCliente(clienteId: string): Promise<TurnoEntity[]>;

  update(
    id: string,
    data: { fecha?: Date; horaInicio?: string; estado?: string; notas?: string },
    userId: string,
    userRole: string,
  ): Promise<TurnoEntity>;

  delete(id: string, userId: string, userRole: string): Promise<void>;

  createFromPago(dto: CreateTurnoServiceDto): Promise<TurnoEntity>;
}
