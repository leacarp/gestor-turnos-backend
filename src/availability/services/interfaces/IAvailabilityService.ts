import { WeeklyScheduleEntity } from "../../domain/entities/weeklySchedule.entity";
import { AvailabilityExceptionEntity } from "../../domain/entities/availabilityException.entity";
import { WeeklyScheduleDtoService } from "src/availability/services/dto/availability-dto.request/weeklySchedule-service.dto";
import { AvailabilityExceptionDtoService } from "src/availability/services/dto/availability-dto.request/availabilityException-service.dto";
import { GetSlotsDtoService } from "src/availability/services/dto/availability-dto.request/getSlots-service.dto";

export interface IAvailabilityService {
  // Schedule
  createSchedule(schedule: WeeklyScheduleDtoService): Promise<WeeklyScheduleEntity>;
  getSchedule(providerId: string): Promise<WeeklyScheduleEntity>;
  updateSchedule(providerId: string, schedule: WeeklyScheduleDtoService): Promise<WeeklyScheduleEntity>;

  // Exceptions
  createException(exception: AvailabilityExceptionDtoService): Promise<AvailabilityExceptionEntity>;
  getExceptionsByMonth(providerId: string, year: number, month: number): Promise<AvailabilityExceptionEntity[]>;
  getExceptionsByDate(providerId: string, date: Date) : Promise<AvailabilityExceptionEntity | null>
  deleteException(exceptionId: string): Promise<void>;

  // Slots
  getAvailableSlots(dto: GetSlotsDtoService): Promise<{ startTime: string; endTime: string }[]>;
}