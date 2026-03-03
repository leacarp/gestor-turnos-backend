import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  private readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  private readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }
}
