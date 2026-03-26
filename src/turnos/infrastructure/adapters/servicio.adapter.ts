import { Injectable, Inject } from '@nestjs/common';
import type { IServicioAdapter } from '../../domain/interfaces/servicio-adapter.interface.js';
import type { IServicioService } from '../../../servicios/domain/interfaces/servicio-service.interface.js';
import { SERVICIO_SERVICE } from '../../../servicios/infrastructure/constants/injection-tokens.js';

@Injectable()
export class ServicioAdapter implements IServicioAdapter {

  constructor(
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
  ) {}

  async exists(id: string): Promise<boolean> {
    try {
      await this.servicioService.findById(id);
      return true;
    } catch {
      return false;
    }
  }

  async belongsToProvider(servicioId: string, proveedorId: string): Promise<boolean> {
    try {
      const servicio = await this.servicioService.findById(servicioId);
      return servicio.getProveedorId() === proveedorId;
    } catch {
      return false;
    }
  }
}
