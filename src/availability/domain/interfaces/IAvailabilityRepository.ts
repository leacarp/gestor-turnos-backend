// domain/repositories/availability.repository.interface.ts
import { WeeklyScheduleEntity } from "../entities/weeklySchedule.entity";
import { AvailabilityExceptionEntity } from "../entities/availabilityException.entity";

export interface IAvailabilityRepository {
  // Weekly Schedule
  createSchedule(data: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity>;
  findScheduleByProvider(providerId: string): Promise<WeeklyScheduleEntity | null>;
  updateSchedule(providerId: string, data: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity | null>;

  // Exceptions
  createException(data: AvailabilityExceptionEntity): Promise<AvailabilityExceptionEntity>;
  findExceptionByDate(providerId: string, date: Date): Promise<AvailabilityExceptionEntity | null>;
  findExceptionsByMonth(providerId: string, year: number, month: number): Promise<AvailabilityExceptionEntity[]>;
  deleteException(exceptionId: string): Promise<boolean>;
}