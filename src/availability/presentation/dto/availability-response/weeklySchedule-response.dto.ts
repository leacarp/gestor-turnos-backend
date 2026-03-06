import { DaySlotResponseDto } from "./daySlot-response.dto";

export class WeeklyScheduleResponseDto {
  id: string;
  providerId: string;
  slots: DaySlotResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}