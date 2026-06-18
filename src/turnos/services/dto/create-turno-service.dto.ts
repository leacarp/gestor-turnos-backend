import { ClientDetailsService } from "./client-details-service.dto";

export class CreateTurnoServiceDto {
  private readonly fecha: Date;
  private readonly horaInicio: string;
  private readonly proveedorId: string;
  private readonly servicioId: string;
  private readonly cliente: ClientDetailsService;
  private readonly notas?: string;

  constructor(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    cliente: ClientDetailsService,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.cliente = cliente;
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

  getCliente(): ClientDetailsService {
    return this.cliente;
  }

  getNotas(): string | undefined {
    return this.notas;
  }
}
