import { Injectable, Inject } from '@nestjs/common';
import { IAppointmentPort } from '../../domain/ports/appointment.port';
import type { ITurnoService } from 'src/turnos/domain/interfaces/turno-service.interface';
import { TURNO_SERVICE } from 'src/turnos/infrastructure/constants/injection-tokens';

@Injectable()
export class AppointmentAdapter implements IAppointmentPort {

  constructor(
    @Inject(TURNO_SERVICE)
    private readonly turnoService: ITurnoService,
  ) {}

  async getBookedSlots(providerId: string, date: Date): Promise<{ startTime: string; endTime: string }[]> {
    const turnos = await this.turnoService.findByProveedor(providerId);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return turnos
      .filter(t => {
        const turnoDate = new Date(t.getFecha());
        const estado = t.getEstado();
        return turnoDate >= startOfDay && turnoDate <= endOfDay
          && (estado === 'pendiente' || estado === 'confirmado');
      })
      .map(t => ({
        startTime: t.getHoraInicio(),
        endTime: t.getHoraInicio(),
      }));
  }
}