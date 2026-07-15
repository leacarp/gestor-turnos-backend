import { TurnoEntity } from '../entities/turno.entity.js';
import { CreateTurnoServiceDto } from 'src/turnos/services/dto/create-turno-service.dto.js';
import { CreateTurnoGuestServiceDto } from 'src/turnos/services/dto/create-turno-guest-service.dto.js';

export interface RecordatorioTurnoDto {
  turnoId: string;
  fecha: Date;
  horaInicio: string;
  clienteNombre: string;
  clienteEmail: string;
  servicioNombre: string;
  proveedorNombre: string;
  proveedorReminderSettings?: {
    telegram: { enabled: boolean; t12h: boolean; t3h: boolean; chatId?: string };
    email: { enabled: boolean; t12h: boolean };
    messageTemplate: string;
  };
}

export interface TurnoCanceladoDto {
  turnoId: string;
  fecha: Date;
  horaInicio: string;
  clienteNombre: string;
  clienteEmail: string;
  servicioNombre: string;
  proveedorNombre: string;
}

export interface AgendaTurnoDto {
  turnoId: string;
  fecha: Date;
  horaInicio: string;
  estado: string;
  clienteNombre: string;
  servicioNombre: string;
  precio: number;
}

export interface CreateTurnoPagoData {
  fecha: Date;
  horaInicio: string;
  proveedorId: string;
  servicioId: string;
  clienteId: string;
  notas?: string;
  pagoId: string;
}

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

  createFromPago(data: CreateTurnoPagoData): Promise<TurnoEntity>;

  getRecordatorios(ventana: '12h' | '3h'): Promise<RecordatorioTurnoDto[]>;

  marcarRecordatorioEnviado(id: string, tipo: '12h' | '3h'): Promise<void>;

  cancelarTurnosDelDia(
    proveedorId: string,
    fecha: Date,
    userId: string,
    userRole: string,
  ): Promise<TurnoCanceladoDto[]>;

  getAgendaDia(
    proveedorId: string,
    fecha: Date,
    userId: string,
    userRole: string,
  ): Promise<AgendaTurnoDto[]>;
}
