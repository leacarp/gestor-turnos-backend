export interface ProviderData {
  id: string;
  name: string;
  role: string;
}

export interface IProviderAdapter {
  findById(id: string): Promise<ProviderData | null>;
  isProvider(id: string): Promise<boolean>;
}
