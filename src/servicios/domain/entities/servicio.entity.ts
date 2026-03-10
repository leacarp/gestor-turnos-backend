export class ServicioEntity {
  private readonly _id?: string;
  private readonly _nombre: string;
  private readonly _duracion: number;
  private readonly _precio: number;
  private readonly _proveedorId: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this._nombre = nombre;
    this._duracion = duracion;
    this._precio = precio;
    this._proveedorId = proveedorId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;
  }

  getId(): string | undefined {
    return this._id;
  }

  getNombre(): string {
    return this._nombre;
  }

  getDuracion(): number {
    return this._duracion;
  }

  getPrecio(): number {
    return this._precio;
  }

  getProveedorId(): string {
    return this._proveedorId;
  }

  getCreatedAt(): Date | undefined {
    return this._createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this._updatedAt;
  }
}
