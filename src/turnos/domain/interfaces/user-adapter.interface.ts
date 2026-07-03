export interface UserContactInfo {
  nombre: string;
  email: string;
  reminderSettings?: {
    telegram: { enabled: boolean; t12h: boolean; t3h: boolean; chatId?: string };
    email: { enabled: boolean; t12h: boolean };
    messageTemplate: string;
  };
}

export interface IUserAdapter {
  existsProvider(id: string): Promise<boolean>;
  existsClient(id: string): Promise<boolean>;
  getContactInfo(id: string): Promise<UserContactInfo | null>;
}
