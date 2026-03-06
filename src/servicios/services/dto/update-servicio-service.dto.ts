export class UpdateServicioServiceDto {
  private readonly nombre?: string;
  private readonly duracion?: number;
  private readonly precio?: number;

  constructor(nombre?: string, duracion?: number, precio?: number) {
    this.nombre = nombre;
    this.duracion = duracion;
    this.precio = precio;
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

  toInfrastructureUpdateData(): {
    nombre?: string;
    duracion?: number;
    precio?: number;
  } {
    return {
      nombre: this.nombre,
      duracion: this.duracion,
      precio: this.precio,
    };
  }
}
