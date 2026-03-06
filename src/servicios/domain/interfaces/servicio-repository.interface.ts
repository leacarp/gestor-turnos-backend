import { ServicioInfrastructureDto } from '../../infrastructure/dto/servicio-infrastructure.dto.js';

export interface IServicioRepository {
  create(dto: ServicioInfrastructureDto): Promise<ServicioInfrastructureDto>;

  findById(id: string): Promise<ServicioInfrastructureDto | null>;

  findAll(): Promise<ServicioInfrastructureDto[]>;

  findByProveedor(proveedorId: string): Promise<ServicioInfrastructureDto[]>;

  update(
    id: string,
    data: { nombre?: string; duracion?: number; precio?: number },
  ): Promise<ServicioInfrastructureDto | null>;

  delete(id: string): Promise<void>;
}
