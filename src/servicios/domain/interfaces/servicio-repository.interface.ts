import { ServicioResponseDto } from '../../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

export interface IServicioRepository {
  create(data: {
    nombre: string;
    duracion: number;
    precio: number;
    proveedorId: string;
  }): Promise<ServicioResponseDto>;

  findById(id: string): Promise<ServicioResponseDto | null>;

  findAll(): Promise<ServicioResponseDto[]>;

  findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]>;

  update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number },
  ): Promise<ServicioResponseDto | null>;

  delete(id: string): Promise<void>;
}
