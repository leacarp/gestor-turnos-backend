export class WeeklyScheduleDtoService {
  private _providerId: string;
  private _slots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
  private _appointmentGap: number;

  constructor(providerId: string, slots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[], appointmentGap: number = 0){
    this._providerId = providerId;
    this._slots = slots;
    this._appointmentGap = appointmentGap;
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

  getAppointmentGap() : number {
    return this._appointmentGap;
  }
}
