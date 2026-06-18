import { ClientDetailsService } from "./client-details-service.dto";

export class CreateTurnoGuestServiceDto {
  private readonly fecha: Date;
  private readonly horaInicio: string;
  private readonly proveedorId: string;
  private readonly servicioId: string;
  private readonly guestDetails : ClientDetailsService;
  private readonly notas?: string;

  constructor(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    ClientDetails: ClientDetailsService,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.guestDetails = ClientDetails;
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

  getGuestDetails() : ClientDetailsService{
    return this.guestDetails;
  }

  getNotas(): string | undefined {
    return this.notas;
  }
}
