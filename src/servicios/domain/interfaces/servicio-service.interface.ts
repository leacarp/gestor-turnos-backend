import { ServicioEntity } from '../entities/servicio.entity.js';

export interface IServicioService {
  create(nombre: string, duracion: number, precio: number, proveedorId: string): Promise<ServicioEntity>;

  findById(id: string): Promise<ServicioEntity>;

  findAll(): Promise<ServicioEntity[]>;

  findByProveedor(proveedorId: string): Promise<ServicioEntity[]>;

  update(id: string, data: { nombre?: string; duracion?: number; precio?: number }, proveedorId: string): Promise<ServicioEntity>;

  delete(id: string, proveedorId: string): Promise<void>;
}
