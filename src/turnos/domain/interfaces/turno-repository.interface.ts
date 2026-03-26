import { TurnoEntity } from '../entities/turno.entity.js';

export interface ITurnoRepository {
  create(entity: TurnoEntity): Promise<TurnoEntity>;

  findById(id: string): Promise<TurnoEntity | null>;

  findAll(): Promise<TurnoEntity[]>;

  findByProveedor(proveedorId: string): Promise<TurnoEntity[]>;

  findByCliente(clienteId: string): Promise<TurnoEntity[]>;

  findByProveedorAndDate(proveedorId: string, fecha: Date): Promise<TurnoEntity[]>;

  update(
    id: string,
    data: { fecha?: Date; horaInicio?: string; estado?: string; notas?: string },
  ): Promise<TurnoEntity | null>;

  delete(id: string): Promise<void>;
}
