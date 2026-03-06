// infrastructure/adapters/appointment.adapter.ts
import { Injectable } from '@nestjs/common';
import { IAppointmentPort } from '../../domain/ports/appointment.port';

@Injectable()
export class AppointmentAdapter implements IAppointmentPort {
  async getBookedSlots(providerId: string, date: Date): Promise<{ startTime: string; endTime: string }[]> {
    // TODO: inyectar AppointmentService cuando exista el módulo
    return [];
  }
}