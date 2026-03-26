export interface IUserAdapter {
  existsProvider(id: string): Promise<boolean>;
  existsClient(id: string): Promise<boolean>;
}
