// domain/services/availability.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IAvailabilityRepository } from '../domain/interfaces/IAvailabilityRepository';
import type { IAvailabilityService } from './interfaces/IAvailabilityService';
import type { IAppointmentPort } from '../domain/ports/appointment.port';
import { WeeklyScheduleEntity } from '../domain/entities/weeklySchedule.entity';
import { AvailabilityExceptionEntity } from '../domain/entities/availabilityException.entity';
import { WeeklyScheduleDtoService } from './dto/availability-dto.request/weeklySchedule-service.dto';
import { AvailabilityExceptionDtoService } from './dto/availability-dto.request/availabilityException-service.dto';
import { GetSlotsDtoService } from './dto/availability-dto.request/getSlots-service.dto';
import type { IUserPort } from '../domain/ports/user.port';
import { empty } from 'rxjs';
 


@Injectable()
export class AvailabilityService implements IAvailabilityService{
  constructor(
    @Inject('IAvailabilityRepository') private readonly availabilityRepository: IAvailabilityRepository,
    @Inject('IAppointmentPort') private readonly appointmentPort: IAppointmentPort,
    @Inject('IUserPort') private readonly userPort : IUserPort
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

    const schedule = new WeeklyScheduleEntity(dto.getProviderId(), dto.getSlots());
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

    const schedule = new WeeklyScheduleEntity(providerId, dto.getSlots());
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

    const bookedSlots = await this.appointmentPort.getBookedSlots(
      dto.getProviderId(),
      dto.getDate(),
    );

    return daySlots.filter(slot =>
      !bookedSlots.some(booked =>
        booked.startTime === slot.startTime &&
        booked.endTime === slot.endTime
      )
    );
  }


}