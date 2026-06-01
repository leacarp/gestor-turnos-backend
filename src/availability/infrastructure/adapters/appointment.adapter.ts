import { Injectable, Inject } from '@nestjs/common';
import { IAppointmentPort } from '../../domain/ports/appointment.port';
import type { ITurnoService } from 'src/turnos/domain/interfaces/turno-service.interface';
import { TURNO_SERVICE } from 'src/turnos/infrastructure/constants/injection-tokens';
import type { IServicioService } from 'src/servicios/domain/interfaces/servicio-service.interface';
import { SERVICIO_SERVICE } from 'src/servicios/infrastructure/constants/injection-tokens';

@Injectable()
export class AppointmentAdapter implements IAppointmentPort {

  constructor(
    @Inject(TURNO_SERVICE)
    private readonly turnoService: ITurnoService,
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
  ) {}

  async getBookedSlots(providerId: string, date: Date): Promise<{ startTime: string; endTime: string }[]> {
    const turnos = await this.turnoService.findByProveedor(providerId);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedTurnos = turnos
      .filter(t => {
        const turnoDate = new Date(t.getFecha());
        const estado = t.getEstado();
        return turnoDate >= startOfDay && turnoDate <= endOfDay
          && (estado === 'pendiente' || estado === 'confirmado');
      });

    return Promise.all(
      bookedTurnos.map(async t => {
        const service = await this.servicioService.findById(t.getServicioId());
        const startMinutes = this.timeToMinutes(t.getHoraInicio());

        return {
          startTime: t.getHoraInicio(),
          endTime: this.minutesToTime(startMinutes + service.getDuracion()),
        };
      }),
    );
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}
