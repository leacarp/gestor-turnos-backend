import { CustomSlotResponseDto } from "./customSlot-response.dto";

export class AvailabilityExceptionResponseDto {
  id: string;
  providerId: string;
  date: Date;
  type: 'day_off' | 'custom_hours';
  customSlots?: CustomSlotResponseDto[];
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}