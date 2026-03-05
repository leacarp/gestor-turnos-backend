import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  private readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  private readonly email: string;

  @IsString()
  @IsNotEmpty()
  private readonly phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  private readonly password: string;

  @IsOptional()
  @IsEnum(['provider', 'user', 'client', 'admin'])
  private readonly role: string;

  constructor(
    name: string,
    email: string,
    phone: string,
    password: string,
    role?: string,
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role ?? 'client';
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPhone(): string {
    return this.phone;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): string {
    return this.role;
  }
}
