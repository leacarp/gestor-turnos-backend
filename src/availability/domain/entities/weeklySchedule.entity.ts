import { NotFoundException } from "@nestjs/common";

export class DaySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export class WeeklyScheduleEntity {
  private _id? : string;
  private _providerId: string;
  private _slots: DaySlot[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(providerId: string, slots: DaySlot[], id?: string, createdAt?: Date, updatedAt?: Date){
    if(!providerId) throw new NotFoundException('providerId is required');
    this._id = id;
    this._providerId = providerId;
    this._slots = slots;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  getId() : string | undefined{
    return this._id;
  }

  getProviderId() : string{
    return this._providerId;
  }

  getSlots() : DaySlot[]{
    return this._slots;
  }

  getCreatedAt() : Date | undefined{
    return this._createdAt;
  }

  getUpdatedAt() : Date | undefined{
    return this._updatedAt;
  }

  getSlotsForDay(dayOfWeek: number): DaySlot[] {
    return this._slots.filter(slot => slot.dayOfWeek === dayOfWeek && slot.isActive);
  }

}