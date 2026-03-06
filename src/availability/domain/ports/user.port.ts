export interface IUserPort {
  existsProvider(providerId: string): Promise<boolean>;
}