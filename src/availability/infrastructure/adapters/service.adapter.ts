import { Injectable, Inject } from '@nestjs/common';
import type { IServicePort } from '../../domain/ports/service.port';
import type { IServicioService } from '../../../servicios/domain/interfaces/servicio-service.interface';
import { SERVICIO_SERVICE } from '../../../servicios/infrastructure/constants/injection-tokens';

@Injectable()
export class ServiceAdapter implements IServicePort {
  constructor(
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
  ) {}

  async getDuration(serviceId: string): Promise<number> {
    const service = await this.servicioService.findById(serviceId);
    return service.getDuracion();
  }

  async belongsToProvider(serviceId: string, providerId: string): Promise<boolean> {
    try {
      const service = await this.servicioService.findById(serviceId);
      return service.getProveedorId() === providerId;
    } catch {
      return false;
    }
  }
}
