export class ServicioEntity {
  private readonly _id?: string;
  private readonly _nombre: string;
  private readonly _duracion: number;
  private readonly _precio: number;
  private readonly _proveedorId: string;
  private readonly _requiereSeña: boolean;
  private readonly _porcentajeSeña: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _categoria: string;

  constructor(
    nombre: string,
    duracion: number,
    precio: number,
    proveedorId: string,
    requiereSeña: boolean = false,
    porcentajeSeña: number = 0,
    categoria: string,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this._nombre = nombre;
    this._duracion = duracion;
    this._precio = precio;
    this._proveedorId = proveedorId;
    this._requiereSeña = requiereSeña;
    this._porcentajeSeña = porcentajeSeña;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;
    this._categoria = categoria;
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

  getRequiereSeña(): boolean {
    return this._requiereSeña;
  }

  getPorcentajeSeña(): number {
    return this._porcentajeSeña;
  }

  calcularMontoSeña(): number {
    if (!this._requiereSeña || this._porcentajeSeña === 0) return 0;
    return Math.round((this._precio * this._porcentajeSeña) / 100);
  }

  getCreatedAt(): Date | undefined {
    return this._createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this._updatedAt;
  }

  getCategoria() : string {
    return this._categoria;
  }
}
