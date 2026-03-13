import {IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import { ProviderDataRequestDto } from './providerData-request.dto';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ProviderDataRequestDto)
  private readonly providerData?: ProviderDataRequestDto;

  constructor(name: string, email: string, phone: string, password: string, role?: string, providerData?: ProviderDataRequestDto ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role ?? 'client';
    this.providerData = providerData;
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
  
  getProviderData(): ProviderDataRequestDto | undefined {
    return this.providerData;
  }
  
}
