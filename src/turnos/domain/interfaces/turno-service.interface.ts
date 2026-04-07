import { TurnoEntity } from '../entities/turno.entity.js';

export interface ITurnoService {
  create(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    notas?: string,
  ): Promise<TurnoEntity>;

  findById(id: string): Promise<TurnoEntity>;

  findAll(): Promise<TurnoEntity[]>;

  findByProveedor(proveedorId: string): Promise<TurnoEntity[]>;

  findByCliente(clienteId: string): Promise<TurnoEntity[]>;

  update(
    id: string,
    data: { fecha?: Date; horaInicio?: string; estado?: string; notas?: string },
    userId: string,
    userRole: string,
  ): Promise<TurnoEntity>;

  delete(id: string, userId: string, userRole: string): Promise<void>;

  createFromPago(
    fecha: Date,
    horaInicio: string,
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    pagoId: string,
    notas?: string,
  ): Promise<TurnoEntity>;
}
