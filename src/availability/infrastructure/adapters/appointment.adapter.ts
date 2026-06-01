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
    const bookedTurnos = await this.turnoService.findByProveedorAndDate(providerId, date);

    return Promise.all(
      bookedTurnos.map(async t => {
        const service = await this.servicioService.findById(t.getServicioId());
        const startMinutes = this.timeToMinutes(t.getHoraInicio());

        return {
          startTime: this.minutesToTime(startMinutes),
          endTime: this.minutesToTime(startMinutes + service.getDuracion()),
        };
      }),
    );
  }

  private timeToMinutes(time: string): number {
    const normalized = time.trim().toUpperCase();
    const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);

    if (!match) {
      return Number.NaN;
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2] ?? 0);
    const meridiem = match[3];

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  private minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}
