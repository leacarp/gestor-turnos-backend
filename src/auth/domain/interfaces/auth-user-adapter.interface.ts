export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface IAuthUserAdapter {
  findByEmail(email: string): Promise<AuthUserData | null>;
  existsByEmail(email: string): Promise<boolean>;
  createUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<AuthUserData>;
}
