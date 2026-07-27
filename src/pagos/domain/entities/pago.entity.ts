export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado' | 'cancelado';

export class PagoEntity {
  private readonly _id?: string;
  private readonly _monto: number;
  private readonly _montoTotal: number;
  private readonly _porcentajeSeña: number;
  private readonly _estado: EstadoPago;
  private readonly _mpPaymentId: string;
  private readonly _mpStatus: string;
  private readonly _mpStatusDetail: string;
  private readonly _mpExternalReference: string;
  private readonly _proveedorId: string;
  private readonly _clienteId?: string;
  private readonly _guestEmail?: string;
  private readonly _servicioId: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(
    monto: number,
    montoTotal: number,
    porcentajeSeña: number,
    estado: EstadoPago,
    mpPaymentId: string,
    mpStatus: string,
    mpStatusDetail: string,
    mpExternalReference: string,
    proveedorId: string,
    servicioId: string,
    clienteId?: string,
    guestEmail?: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this._monto = monto;
    this._montoTotal = montoTotal;
    this._porcentajeSeña = porcentajeSeña;
    this._estado = estado;
    this._mpPaymentId = mpPaymentId;
    this._mpStatus = mpStatus;
    this._mpStatusDetail = mpStatusDetail;
    this._mpExternalReference = mpExternalReference;
    this._proveedorId = proveedorId;
    this._servicioId = servicioId;
    this._clienteId = clienteId;
    this._guestEmail = guestEmail;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;
  }

  getId(): string | undefined { return this._id; }
  getMonto(): number { return this._monto; }
  getMontoTotal(): number { return this._montoTotal; }
  getPorcentajeSeña(): number { return this._porcentajeSeña; }
  getEstado(): EstadoPago { return this._estado; }
  getMpPaymentId(): string { return this._mpPaymentId; }
  getMpStatus(): string { return this._mpStatus; }
  getMpStatusDetail(): string { return this._mpStatusDetail; }
  getMpExternalReference(): string { return this._mpExternalReference; }
  getProveedorId(): string { return this._proveedorId; }
  getClienteId(): string | undefined { return this._clienteId; }
  getGuestEmail(): string | undefined { return this._guestEmail; }
  getServicioId(): string { return this._servicioId; }
  getCreatedAt(): Date | undefined { return this._createdAt; }
  getUpdatedAt(): Date | undefined { return this._updatedAt; }
}
