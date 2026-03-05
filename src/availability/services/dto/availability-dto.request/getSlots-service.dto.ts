export class GetSlotsDtoService {
  private _providerId: string;
  private _date: Date;

  constructor(providerId: string, date: Date){
    this._providerId = providerId;
    this._date = date;
  }

  getProviderId() : string{
    return this._providerId;
  }

  getDate() : Date{
    return this._date;
  }
}