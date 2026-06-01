export class UpdateServicioServiceDto {
  private readonly nombre?: string;
  private readonly duracion?: number;
  private readonly precio?: number;
  private readonly requiereSeña?: boolean;
  private readonly porcentajeSeña?: number;
  private readonly categoria?: string;
  private readonly description?: string;

  constructor(nombre?: string, duracion?: number, precio?: number, requiereSeña?: boolean, porcentajeSeña?: number, categoria? : string, description?: string) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
    this.requiereSeña = requiereSeña;
    this.porcentajeSeña = porcentajeSeña;
    this.categoria = categoria;
    this.description = description;
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

  getCategoria() : string | undefined{
    return this.categoria;
  }

  toUpdateData(): {
    nombre?: string;
    duracion?: number;
    precio?: number;
    requiereSeña?: boolean;
    porcentajeSeña?: number;
    categoria? : string;
    description?: string;
  } {
    return {
      nombre: this.nombre,
      duracion: this.duracion,
      precio: this.precio,
      requiereSeña: this.requiereSeña,
      porcentajeSeña: this.porcentajeSeña,
      categoria: this.categoria,
      description: this.description,
    };
  }
}
