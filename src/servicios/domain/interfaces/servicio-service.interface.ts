import { CreateServicioRequestDto } from '../../presentation/dtos/servicio-dto-request/create-servicio-request.dto.js';
import { UpdateServicioRequestDto } from '../../presentation/dtos/servicio-dto-request/update-servicio-request.dto.js';
import { ServicioResponseDto } from '../../presentation/dtos/servicio-dto-response/servicio-response.dto.js';

export interface IServicioService {
  create(dto: CreateServicioRequestDto, proveedorId: string): Promise<ServicioResponseDto>;

  findById(id: string): Promise<ServicioResponseDto>;

  findAll(): Promise<ServicioResponseDto[]>;

  findByProveedor(proveedorId: string): Promise<ServicioResponseDto[]>;

  update(id: string, dto: UpdateServicioRequestDto, proveedorId: string): Promise<ServicioResponseDto>;

  delete(id: string, proveedorId: string): Promise<void>;
}
