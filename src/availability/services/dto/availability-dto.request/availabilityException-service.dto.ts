export class AvailabilityExceptionDtoService {
  private _providerId: string;
  private _date: Date;
  private _type: 'day_off' | 'custom_hours';
  private _customSlots?: { startTime: string; endTime: string }[];
  private _reason?: string;

  constructor(providerId: string, date: Date, type:'day_off' | 'custom_hours', customSlots?: { startTime: string; endTime: string }[], reason? : string ){
    this._providerId = providerId;
    this._date = date;
    this._type = type;
    this._customSlots = customSlots;
    this._reason = reason;
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

  getCustomSlots() : { startTime: string; endTime: string }[] | undefined{
    return this._customSlots;
  }

  getReason() : string | undefined{
    return this._reason;
  }
}