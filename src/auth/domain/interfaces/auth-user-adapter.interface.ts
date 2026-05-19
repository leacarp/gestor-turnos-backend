export interface AuthSocialMediaData {
  platform: string;
  url: string;
}

export interface AuthProviderData {
  publicInfo?: string;
  address: string;
  minimumAdvance?: number;
  serviceType: string;
  socialMedia?: AuthSocialMediaData[];
}

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface CreateAuthUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  providerData?: AuthProviderData;
}

export interface IAuthUserAdapter {
  findByEmail(email: string): Promise<AuthUserData | null>;
  existsByEmail(email: string): Promise<boolean>;
  createUser(userData: CreateAuthUserData): Promise<AuthUserData>;
}
