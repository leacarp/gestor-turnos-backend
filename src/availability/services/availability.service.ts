// domain/services/availability.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IAvailabilityRepository } from '../domain/interfaces/IAvailabilityRepository';
import type { IAvailabilityService } from './interfaces/IAvailabilityService';
import type { IAppointmentPort } from '../domain/ports/appointment.port';
import type { IServicePort } from '../domain/ports/service.port';
import { WeeklyScheduleEntity } from '../domain/entities/weeklySchedule.entity';
import { AvailabilityExceptionEntity } from '../domain/entities/availabilityException.entity';
import { WeeklyScheduleDtoService } from './dto/availability-dto.request/weeklySchedule-service.dto';
import { AvailabilityExceptionDtoService } from './dto/availability-dto.request/availabilityException-service.dto';
import { GetSlotsDtoService } from './dto/availability-dto.request/getSlots-service.dto';
import type { IUserPort } from '../domain/ports/user.port';
import { AVAILABILITY_REPOSITORY, APPOINTMENT_PORT, USER_PORT, SERVICE_PORT } from '../infrastructure/constants/injection-tokens';
 


@Injectable()
export class AvailabilityService implements IAvailabilityService{
  constructor(
    @Inject(AVAILABILITY_REPOSITORY) private readonly availabilityRepository: IAvailabilityRepository,
    @Inject(APPOINTMENT_PORT) private readonly appointmentPort: IAppointmentPort,
    @Inject(USER_PORT) private readonly userPort : IUserPort,
    @Inject(SERVICE_PORT) private readonly servicePort : IServicePort
  ) {}

  async createSchedule(dto: WeeklyScheduleDtoService): Promise<WeeklyScheduleEntity> {
    const providerExists = await this.userPort.existsProvider(dto.getProviderId());
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }
    
    const existing = await this.availabilityRepository.findScheduleByProvider(dto.getProviderId());
    if (existing) {
      throw new BadRequestException('Provider already has a schedule');
    }

    const schedule = new WeeklyScheduleEntity(dto.getProviderId(), dto.getSlots(), undefined, undefined, undefined, dto.getAppointmentGap());
    return this.availabilityRepository.createSchedule(schedule);
  }

  async getSchedule(providerId: string): Promise<WeeklyScheduleEntity> {
    const providerExists = await this.userPort.existsProvider(providerId);
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }

    const schedule = await this.availabilityRepository.findScheduleByProvider(providerId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found for this provider');
    }
    return schedule;
  }

  async updateSchedule(providerId : string, dto: WeeklyScheduleDtoService): Promise<WeeklyScheduleEntity> {
    const providerExists = await this.userPort.existsProvider(providerId);
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }

    const schedule = new WeeklyScheduleEntity(providerId, dto.getSlots(), undefined, undefined, undefined, dto.getAppointmentGap());
    const updated = await this.availabilityRepository.updateSchedule(providerId, schedule);
    if (!updated) {
      throw new NotFoundException('Schedule not found for this provider');
    }
    return updated;
  }

  // --- Exceptions ---

  async createException(dto: AvailabilityExceptionDtoService): Promise<AvailabilityExceptionEntity> {
    const providerExists = await this.userPort.existsProvider(dto.getProviderId());
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }

    const existing = await this.availabilityRepository.findExceptionByDate(
      dto.getProviderId(),
      dto.getDate(),
    );
    if (existing) {
      throw new BadRequestException('An exception already exists for this date');
    }

    const exception = new AvailabilityExceptionEntity(
      dto.getProviderId(),
      dto.getDate(),
      dto.getType(),
      undefined,       // id lo asigna Mongo
      dto.getCustomSlots(),
      dto.getReason(),
    );
    return this.availabilityRepository.createException(exception);
  }

  async getExceptionsByMonth(providerId: string, year: number, month: number): Promise<AvailabilityExceptionEntity[]> {
    if (!year || !month) {
      throw new BadRequestException('year and month are required');
    }

    return this.availabilityRepository.findExceptionsByMonth(providerId, year, month);
  }

  async getExceptionsByDate(providerId: string, date: Date): Promise<AvailabilityExceptionEntity | null> {
    return this.availabilityRepository.findExceptionByDate(providerId, date);
  }

  async deleteException(exceptionId: string): Promise<void> {
    const deleted = await this.availabilityRepository.deleteException(exceptionId);
    if (!deleted) {
      throw new NotFoundException('Exception not found');
    }
  }

  // --- Available Slots ---

  async getAvailableSlots(dto: GetSlotsDtoService): Promise<{ startTime: string; endTime: string }[]> {
    const providerExists = await this.userPort.existsProvider(dto.getProviderId());
    if (!providerExists) {
      throw new NotFoundException('Provider not found');
    }

    const serviceBelongsToProvider = await this.servicePort.belongsToProvider(
      dto.getServiceId(),
      dto.getProviderId(),
    );
    if (!serviceBelongsToProvider) {
      throw new BadRequestException('Service does not belong to provider');
    }
    
    const schedule = await this.availabilityRepository.findScheduleByProvider(dto.getProviderId());
    if (!schedule) {
      throw new NotFoundException('Schedule not found for this provider');
    }

    const exception = await this.availabilityRepository.findExceptionByDate(
      dto.getProviderId(),
      dto.getDate(),
    );

    if (exception?.isFullDayOff()) {
      return [];
    }

    const daySlots = exception?.hasCustomHours()
      ? exception.getCustomSlots()!
      : schedule.getSlotsForDay(dto.getDate().getDay());

    if (!daySlots || daySlots.length === 0) {
      return [];
    }

    const serviceDuration = await this.servicePort.getDuration(dto.getServiceId());
    const possibleSlots = this.splitSlotsByDuration(daySlots, serviceDuration, schedule.getAppointmentGap());
    const bookedSlots = await this.appointmentPort.getBookedSlots(
      dto.getProviderId(),
      dto.getDate(),
    );

    const availableSlots = possibleSlots.filter(slot =>
      !bookedSlots.some(booked => this.overlaps(slot, booked))
    );

    if (!this.isToday(dto.getDate())) {
      return availableSlots;
    }

    const nowMinutes = this.getCurrentTimeInMinutes();
    return availableSlots.filter(slot => this.timeToMinutes(slot.startTime) > nowMinutes);
  }

  private splitSlotsByDuration(
    daySlots: { startTime: string; endTime: string }[],
    durationInMinutes: number,
    gapInMinutes: number = 0,
  ): { startTime: string; endTime: string }[] {
    const slots: { startTime: string; endTime: string }[] = [];
    const step = durationInMinutes + gapInMinutes;

    for (const daySlot of daySlots) {
      const blockStart = this.timeToMinutes(daySlot.startTime);
      const blockEnd = this.timeToMinutes(daySlot.endTime);

      for (
        let start = blockStart;
        start + durationInMinutes <= blockEnd;
        start += step
      ) {
        slots.push({
          startTime: this.minutesToTime(start),
          endTime: this.minutesToTime(start + durationInMinutes),
        });
      }
    }

    return slots;
  }

  private overlaps(
    slot: { startTime: string; endTime: string },
    booked: { startTime: string; endTime: string },
  ): boolean {
    const slotStart = this.timeToMinutes(slot.startTime);
    const slotEnd = this.timeToMinutes(slot.endTime);
    const bookedStart = this.timeToMinutes(booked.startTime);
    const bookedEnd = this.timeToMinutes(booked.endTime);

    return slotStart < bookedEnd && bookedStart < slotEnd;
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

  private getNowInArgentina(): Date {
    const now = new Date();
    const tzString = now.toLocaleString('en-US', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour12: false,
    });
    return new Date(tzString);
  }

  private isToday(date: Date): boolean {
    const now = this.getNowInArgentina();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth()    === now.getMonth()    &&
      date.getDate()     === now.getDate()
    );
  }

  private getCurrentTimeInMinutes(): number {
    const now = this.getNowInArgentina();
    return now.getHours() * 60 + now.getMinutes();
  }


}
