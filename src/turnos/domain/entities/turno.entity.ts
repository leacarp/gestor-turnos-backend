import { BadRequestException } from "@nestjs/common";
import { ClienteEntity } from "./cliente.entity";
import { CreateTurnoServiceDto } from "src/turnos/services/dto/create-turno-service.dto";
import { CreateTurnoGuestServiceDto } from "src/turnos/services/dto/create-turno-guest-service.dto";
export class TurnoEntity {
  private readonly _id?: string;
  private readonly _fecha: Date;
  private readonly _horaInicio: string;
  private readonly _estado: string;
  private readonly _notas?: string;
  private readonly _proveedorId: string;
  private readonly _servicioId: string;
  private readonly _pagoId?: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _cliente: ClienteEntity;
  private readonly _recordatorio12hEnviado: boolean;
  private readonly _recordatorio3hEnviado: boolean;


  constructor(
    props: {
    fecha: Date;
    horaInicio: string;
    estado: string;
    proveedorId: string;
    servicioId: string;
    cliente: ClienteEntity;
    notas?: string;
    pagoId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
    recordatorio12hEnviado?: boolean;
    recordatorio3hEnviado?: boolean;
  }
  ) {
    this._fecha = props.fecha;
    this._horaInicio = props.horaInicio;
    this._estado = props.estado || 'pendiente';
    this._proveedorId = props.proveedorId;
    this._servicioId = props.servicioId;
    this._cliente = props.cliente;
    this._notas = props.notas;
    this._pagoId = props.pagoId;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._id = props.id;
    this._recordatorio12hEnviado = props.recordatorio12hEnviado ?? false;
    this._recordatorio3hEnviado = props.recordatorio3hEnviado ?? false;
  }

  getId(): string | undefined {
    return this._id;
  }

  getFecha(): Date {
    return this._fecha;
  }

  getHoraInicio(): string {
    return this._horaInicio;
  }

  getEstado(): string {
    return this._estado;
  }

  getNotas(): string | undefined {
    return this._notas;
  }

  getProveedorId(): string {
    return this._proveedorId;
  }

  getServicioId(): string {
    return this._servicioId;
  }

  getCliente() : ClienteEntity {
    return this._cliente;
  }

  getPagoId(): string | undefined {
    return this._pagoId;
  }

  getCreatedAt(): Date | undefined {
    return this._createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this._updatedAt;
  }

  getRecordatorio12hEnviado(): boolean {
    return this._recordatorio12hEnviado;
  }

  getRecordatorio3hEnviado(): boolean {
    return this._recordatorio3hEnviado;
  }

  static createForRegistered(dto: CreateTurnoServiceDto, id: string): TurnoEntity {
    const cliente = ClienteEntity.createRegistered(id);
  
    return new TurnoEntity({
    fecha: new Date(dto.getFecha()),
    horaInicio: dto.getHoraInicio(),
    estado: 'pendiente',
    proveedorId: dto.getProveedorId(),
    servicioId: dto.getServicioId(),
    cliente: cliente,
    notas: dto.getNotas()
    })
  }

  static createForGuest(dto: CreateTurnoGuestServiceDto) : TurnoEntity{
    const nombre = dto.getGuestDetails().getNombre() ?? 'Nombre vacio';
    const email = dto.getGuestDetails().getEmail() ?? 'Email vacio';
    const celular = dto.getGuestDetails().getCelular() ?? 'Celular vacio';
    const cliente = ClienteEntity.createGuest(nombre, email, celular);

    return new TurnoEntity({
    fecha: new Date(dto.getFecha()),
    horaInicio: dto.getHoraInicio(),
    estado: 'pendiente',
    proveedorId: dto.getProveedorId(),
    servicioId: dto.getServicioId(),
    cliente: cliente,
    notas: dto.getNotas()
  })
  }
}
