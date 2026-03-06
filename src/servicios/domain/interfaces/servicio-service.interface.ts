import { CreateServicioServiceDto } from '../../services/dto/create-servicio-service.dto.js';
import { UpdateServicioServiceDto } from '../../services/dto/update-servicio-service.dto.js';
import { ServicioResponseDto } from '../../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

export interface IServicioService {
  create(dto: CreateServicioServiceDto, proveedorId: string): Promise<ServicioResponseDto>;

  findById(id: string): Promise<ServicioResponseDto>;

  findAll(): Promise<ServicioResponseDto[]>;

  findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]>;

  update(id: string, dto: UpdateServicioServiceDto, proveedorId: string): Promise<ServicioResponseDto>;

  delete(id: string, proveedorId: string): Promise<void>;
}
