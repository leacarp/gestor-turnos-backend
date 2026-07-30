import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';

import type {
  ITurnoService,
  RecordatorioTurnoDto,
  TurnoCanceladoDto,
  AgendaTurnoDto,
  CreateTurnoPagoData,
  CreateTurnoGuestPagoData
} from '../domain/interfaces/turno-service.interface.js';
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

const RECORDATORIO_TOLERANCIA_MS = 20 * 60 * 1000;

// Instancia de n8n desplegada en Railway. Las env vars mandan; esto es el fallback
// para que las automatizaciones no queden apuntando a la nada si faltan.
const N8N_BASE_URL = 'https://primary-production-e79b2.up.railway.app';
const N8N_WEBHOOK_TURNO_CREADO =
  process.env.N8N_WEBHOOK_TURNO_CREADO || `${N8N_BASE_URL}/webhook/turno-creado`;
const N8N_WEBHOOK_CANCELACION_DIA =
  process.env.N8N_WEBHOOK_CANCELACION_DIA || `${N8N_BASE_URL}/webhook/cancelacion-dia`;

@Injectable()
export class TurnoService implements ITurnoService {
  private readonly logger = new Logger(TurnoService.name);

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
    const creado = await this.turnoRepository.create(turno);
    await this.notificarTurnoCreado(creado);
    return creado;
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
    const creado = await this.turnoRepository.create(turno);
    await this.notificarTurnoCreado(creado);
    return creado;
  }

  async createFromPago(data: CreateTurnoPagoData): Promise<TurnoEntity> {
    const turno = TurnoEntity.createFromPayment(data);
    const creado = this.turnoRepository.create(turno);
    await this.notificarTurnoCreado(await creado);
    return creado;
  }

  async createGuestFromPago(data: CreateTurnoGuestPagoData): Promise<TurnoEntity> {
    const turno = TurnoEntity.createGuestFromPayment(data);
    const creado = await this.turnoRepository.create(turno);
    await this.notificarTurnoCreado(creado);
    return creado;
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

  private async getClienteInfo(turno: TurnoEntity): Promise<{ nombre: string; email: string }> {
    const cliente = turno.getCliente();

    if (cliente.getTipo() === 'REGISTRADO') {
      const info = await this.userAdapter.getContactInfo(cliente.getId()!);
      return { nombre: info?.nombre ?? 'Cliente', email: info?.email ?? '' };
    }

    return { nombre: cliente.getNombre()!, email: cliente.getEmail()! };
  }

  private notificarN8n(url: string | undefined, payload: unknown): void {
    if (!url) return;

    axios.post(url, payload).catch((error) => {
      this.logger.warn(`No se pudo notificar a n8n (${url}): ${error.message}`);
    });
  }

  private async notificarTurnoCreado(turno: TurnoEntity): Promise<void> {
    const [cliente, proveedor, servicio] = await Promise.all([
      this.getClienteInfo(turno),
      this.userAdapter.getContactInfo(turno.getProveedorId()),
      this.servicioAdapter.getInfo(turno.getServicioId()),
    ]);

    this.notificarN8n(N8N_WEBHOOK_TURNO_CREADO, {
      turnoId: turno.getId(),
      fecha: turno.getFecha(),
      horaInicio: turno.getHoraInicio(),
      clienteNombre: cliente.nombre,
      clienteEmail: cliente.email,
      servicioNombre: servicio?.nombre ?? 'Servicio',
      precio: servicio?.precio ?? 0,
      proveedorNombre: proveedor?.nombre ?? 'Proveedor',
      notas: turno.getNotas() ?? '',
    });
  }

  async getRecordatorios(ventana: '12h' | '3h'): Promise<RecordatorioTurnoDto[]> {
    const horas = ventana === '12h' ? 12 : 3;
    const campoFlag = ventana === '12h' ? 'recordatorio12hEnviado' : 'recordatorio3hEnviado';

    const ahora = new Date();
    const objetivo = new Date(ahora.getTime() + horas * 60 * 60 * 1000);
    const ventanaInicio = new Date(objetivo.getTime() - RECORDATORIO_TOLERANCIA_MS);
    const ventanaFin = new Date(objetivo.getTime() + RECORDATORIO_TOLERANCIA_MS);

    const turnos = await this.turnoRepository.findPendientesRecordatorio(
      ventanaInicio,
      ventanaFin,
      campoFlag,
    );

    const resultados: RecordatorioTurnoDto[] = [];

    for (const turno of turnos) {
      const [cliente, proveedor, servicio] = await Promise.all([
        this.getClienteInfo(turno),
        this.userAdapter.getContactInfo(turno.getProveedorId()),
        this.servicioAdapter.getInfo(turno.getServicioId()),
      ]);

      resultados.push({
        turnoId: turno.getId()!,
        fecha: turno.getFecha(),
        horaInicio: turno.getHoraInicio(),
        clienteNombre: cliente.nombre,
        clienteEmail: cliente.email,
        servicioNombre: servicio?.nombre ?? 'Servicio',
        proveedorNombre: proveedor?.nombre ?? 'Proveedor',
        proveedorReminderSettings: proveedor?.reminderSettings,
      });
    }

    return resultados;
  }

  async marcarRecordatorioEnviado(id: string, tipo: '12h' | '3h'): Promise<void> {
    const campoFlag = tipo === '12h' ? 'recordatorio12hEnviado' : 'recordatorio3hEnviado';
    await this.turnoRepository.marcarRecordatorioEnviado(id, campoFlag);
  }

  async cancelarTurnosDelDia(
    proveedorId: string,
    fecha: Date,
    userId: string,
    userRole: string,
  ): Promise<TurnoCanceladoDto[]> {
    if (userRole !== 'admin' && !(userRole === 'provider' && userId === proveedorId)) {
      throw new ForbiddenException('No tenés permisos para cancelar los turnos de este proveedor');
    }

    const cancelados = await this.turnoRepository.cancelarTurnosDelDia(proveedorId, fecha);

    const resultados: TurnoCanceladoDto[] = [];

    for (const turno of cancelados) {
      const [cliente, proveedor, servicio] = await Promise.all([
        this.getClienteInfo(turno),
        this.userAdapter.getContactInfo(turno.getProveedorId()),
        this.servicioAdapter.getInfo(turno.getServicioId()),
      ]);

      resultados.push({
        turnoId: turno.getId()!,
        fecha: turno.getFecha(),
        horaInicio: turno.getHoraInicio(),
        clienteNombre: cliente.nombre,
        clienteEmail: cliente.email,
        servicioNombre: servicio?.nombre ?? 'Servicio',
        proveedorNombre: proveedor?.nombre ?? 'Proveedor',
      });
    }

    this.notificarN8n(N8N_WEBHOOK_CANCELACION_DIA, { turnos: resultados });

    return resultados;
  }

  async getAgendaDia(
    proveedorId: string,
    fecha: Date,
    userId: string,
    userRole: string,
  ): Promise<AgendaTurnoDto[]> {
    if (userRole !== 'admin' && !(userRole === 'provider' && userId === proveedorId)) {
      throw new ForbiddenException('No tenés permisos para ver la agenda de este proveedor');
    }

    const turnos = await this.turnoRepository.findByProveedorAndDiaTodos(proveedorId, fecha);

    const resultados: AgendaTurnoDto[] = [];

    for (const turno of turnos) {
      const [cliente, servicio] = await Promise.all([
        this.getClienteInfo(turno),
        this.servicioAdapter.getInfo(turno.getServicioId()),
      ]);

      resultados.push({
        turnoId: turno.getId()!,
        fecha: turno.getFecha(),
        horaInicio: turno.getHoraInicio(),
        estado: turno.getEstado(),
        clienteNombre: cliente.nombre,
        servicioNombre: servicio?.nombre ?? 'Servicio',
        precio: servicio?.precio ?? 0,
      });
    }

    return resultados;
  }

}
