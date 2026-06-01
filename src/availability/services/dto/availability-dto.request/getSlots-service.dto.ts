export class GetSlotsDtoService {
  private _providerId: string;
  private _date: Date;
  private _serviceId: string;

  constructor(providerId: string, date: Date, serviceId: string){
    this._providerId = providerId;
    this._date = date;
    this._serviceId = serviceId;
  }

  getProviderId() : string{
    return this._providerId;
  }

  getDate() : Date{
    return this._date;
  }

  getServiceId() : string{
    return this._serviceId;
  }
}
