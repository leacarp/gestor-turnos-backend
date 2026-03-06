export class CustomSlot {
  startTime: string;
  endTime: string;
}

export class AvailabilityExceptionEntity {
  private _id?: string;
  private _providerId: string;
  private _date: Date;
  private _type: 'day_off' | 'custom_hours';
  private _customSlots?: CustomSlot[];
  private _reason?: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(providerId: string, date : Date, type : 'day_off' | 'custom_hours', id? : string, customSlots? : CustomSlot[], reason? : string, createdAt? : Date, updatedAt?: Date){
    if(!date) throw new Error('date is required');
    if (type === 'custom_hours' && (!customSlots || customSlots.length === 0)) throw new Error('customSlots is required when type is custom_hours');
  
    this._id = id;
    this._providerId = providerId;
    this._date = date;
    this._type = type;
    this._customSlots = customSlots;
    this._reason = reason;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  getId() : string | undefined{
    return this._id;
  }

  getProviderId() : string{
    return this._providerId;
  }

  getDate() : Date{
    return this._date;
  }

  getType() : 'day_off' | 'custom_hours'{
    return this._type;
  }

  getCustomSlots() : CustomSlot[] | undefined{
    return this._customSlots;
  }

  getReason() : string | undefined{
    return this._reason;
  }

  getCreatedAt() : Date | undefined{
    return this._createdAt;
  }

  getUpdatedAt() : Date | undefined{
    return this._updatedAt;
  }

  isFullDayOff(): boolean {
    return this._type === 'day_off';
  }

  hasCustomHours(): boolean {
    return this._type === 'custom_hours' && !!this._customSlots?.length;
  }
}