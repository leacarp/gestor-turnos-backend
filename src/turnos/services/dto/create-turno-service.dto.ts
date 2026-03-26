export class CreateTurnoServiceDto {
  private readonly fecha: Date;
  private readonly horaInicio: string;
  private readonly proveedorId: string;
  private readonly servicioId: string;
  private readonly clienteId: string;
  private readonly notas?: string;

  constructor(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.clienteId = clienteId;
    this.notas = notas;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getHoraInicio(): string {
    return this.horaInicio;
  }

  getProveedorId(): string {
    return this.proveedorId;
  }

  getServicioId(): string {
    return this.servicioId;
  }

  getClienteId(): string {
    return this.clienteId;
  }

  getNotas(): string | undefined {
    return this.notas;
  }
}
