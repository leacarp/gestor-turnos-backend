import { GuestDetailsService } from "./guestDetails-service.dto";

export class CreateTurnoGuestServiceDto {
  private readonly fecha: Date;
  private readonly horaInicio: string;
  private readonly proveedorId: string;
  private readonly servicioId: string;
  private readonly guestDetails : GuestDetailsService;
  private readonly notas?: string;

  constructor(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    guestDetails: GuestDetailsService,
    notas?: string,
  ) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.proveedorId = proveedorId;
    this.servicioId = servicioId;
    this.guestDetails = guestDetails;
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

  getGuestDetails() : GuestDetailsService{
    return this.guestDetails;
  }

  getNotas(): string | undefined {
    return this.notas;
  }
}
