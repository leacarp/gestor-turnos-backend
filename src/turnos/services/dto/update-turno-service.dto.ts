export class UpdateTurnoServiceDto {
  private readonly fecha?: Date;
  private readonly horaInicio?: string;
  private readonly estado?: string;
  private readonly notas?: string;

  constructor(fecha?: Date, horaInicio?: string, estado?: string, notas?: string) {
    this.fecha = fecha;
    this.horaInicio = horaInicio;
    this.estado = estado;
    this.notas = notas;
  }

  getFecha(): Date | undefined {
    return this.fecha;
  }

  getHoraInicio(): string | undefined {
    return this.horaInicio;
  }

  getEstado(): string | undefined {
    return this.estado;
  }

  getNotas(): string | undefined {
    return this.notas;
  }

  toUpdateData(): {
    fecha?: Date;
    horaInicio?: string;
    estado?: string;
    notas?: string;
  } {
    return {
      fecha: this.fecha,
      horaInicio: this.horaInicio,
      estado: this.estado,
      notas: this.notas,
    };
  }
}
