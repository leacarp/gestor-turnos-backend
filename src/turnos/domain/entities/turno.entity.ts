export class TurnoEntity {
  private readonly _id?: string;
  private readonly _fecha: Date;
  private readonly _horaInicio: string;
  private readonly _estado: string;
  private readonly _notas?: string;
  private readonly _proveedorId: string;
  private readonly _servicioId: string;
  private readonly _clienteId: string;
  private readonly _pagoId?: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(
    fecha: Date,
    horaInicio: string,
    estado: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    notas?: string,
    pagoId?: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this._fecha = fecha;
    this._horaInicio = horaInicio;
    this._estado = estado;
    this._proveedorId = proveedorId;
    this._servicioId = servicioId;
    this._clienteId = clienteId;
    this._notas = notas;
    this._pagoId = pagoId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;
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

  getClienteId(): string {
    return this._clienteId;
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
}
