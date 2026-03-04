import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { IAuthService } from '../domain/interfaces/auth-service.interface.js';
import type { IAuthUserAdapter, AuthUserData } from '../domain/interfaces/auth-user-adapter.interface.js';
import { AUTH_USER_ADAPTER } from '../infrastructure/constants/injection-tokens.js';

import { LoginRequestDto } from '../presentation/dtos/auth-dto-request/login-request.dto.js';
import { RegisterRequestDto } from '../presentation/dtos/auth-dto-request/register-request.dto.js';
import { AuthResponseDto } from '../presentation/dtos/auth-dto-response/auth-response.dto.js';
import { AuthUserDto } from '../presentation/dtos/auth-dto-response/auth-user.dto.js';

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject(AUTH_USER_ADAPTER)
    private readonly userAdapter: IAuthUserAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const email = loginDto.getEmail();
    const password = loginDto.getPassword();

    const user = await this.userAdapter.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return this.buildAuthResponse(token, user);
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const email = registerDto.getEmail();

    const emailExists = await this.userAdapter.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.getPassword(), 10);

    const savedUser = await this.userAdapter.createUser({
      name: registerDto.getName(),
      email: registerDto.getEmail(),
      phone: registerDto.getPhone(),
      password: hashedPassword,
      role: registerDto.getRole(),
    });

    const token = this.generateToken(savedUser);

    return this.buildAuthResponse(token, savedUser);
  }

  private generateToken(user: AuthUserData): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private buildAuthResponse(token: string, user: AuthUserData): AuthResponseDto {
    const authUser = new AuthUserDto(
      user.id,
      user.name,
      user.email,
      user.role,
    );

    return new AuthResponseDto(token, authUser);
  }
}
