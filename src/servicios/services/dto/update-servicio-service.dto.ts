export class UpdateServicioServiceDto {
  private readonly nombre?: string;
  private readonly duracion?: number;
  private readonly precio?: number;
  private readonly requiereSeña?: boolean;
  private readonly porcentajeSeña?: number;

  constructor(nombre?: string, duracion?: number, precio?: number, requiereSeña?: boolean, porcentajeSeña?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.requiereSeña = requiereSeña;
    this.porcentajeSeña = porcentajeSeña;
  }

  getNombre(): string | undefined {
    return this.nombre;
  }

  getDuracion(): number | undefined {
    return this.duracion;
  }

  getPrecio(): number | undefined {
    return this.precio;
  }

  getRequiereSeña(): boolean | undefined {
    return this.requiereSeña;
  }

  getPorcentajeSeña(): number | undefined {
    return this.porcentajeSeña;
  }

  toUpdateData(): {
    nombre?: string;
    duracion?: number;
    precio?: number;
    requiereSeña?: boolean;
    porcentajeSeña?: number;
  } {
    return {
      nombre: this.nombre,
      duracion: this.duracion,
      precio: this.precio,
      requiereSeña: this.requiereSeña,
      porcentajeSeña: this.porcentajeSeña,
    };
  }
}
