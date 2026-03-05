export interface IAppointmentPort {
  getBookedSlots(providerId: string, date: Date): Promise<{ startTime: string; endTime: string }[]>;
}