export interface IServicePort {
  getDuration(serviceId: string): Promise<number>;
  belongsToProvider(serviceId: string, providerId: string): Promise<boolean>;
}
