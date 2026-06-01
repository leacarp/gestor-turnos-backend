import { ServicioEntity } from '../entities/servicio.entity.js';

export interface IServicioRepository {
  create(entity: ServicioEntity): Promise<ServicioEntity>;

  findById(id: string): Promise<ServicioEntity | null>;

  findAll(): Promise<ServicioEntity[]>;

  findByProveedor(proveedorId: string): Promise<ServicioEntity[]>;

  update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number; requiereSeña?: boolean; porcentajeSeña?: number; categoria?: string; description?: string },
  ): Promise<ServicioEntity | null>;

  delete(id: string): Promise<void>;
}
