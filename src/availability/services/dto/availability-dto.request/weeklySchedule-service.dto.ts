export class WeeklyScheduleDtoService {
  private _providerId: string;
  private _slots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];

  constructor(providerId: string, slots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[] ){
    this._providerId = providerId;
    this._slots = slots;
  }

  getProviderId() : string{
    return this._providerId;
  }

  getSlots() : {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[] {
    return this._slots;
  }
}