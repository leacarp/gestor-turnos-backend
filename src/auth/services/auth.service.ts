import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { IAuthService } from '../domain/interfaces/auth-service.interface.js';
import type { IUserRepository } from '../../user/domain/interfaces/IUserRepository.js';
import { USER_REPOSITORY } from '../../user/infrastructure/constants/user-repository.constants.js';

import { LoginRequestDto } from '../presentation/dtos/auth-dto-request/login-request.dto.js';
import { RegisterRequestDto } from '../presentation/dtos/auth-dto-request/register-request.dto.js';
import { AuthResponseDto } from '../presentation/dtos/auth-dto-response/auth-response.dto.js';
import { AuthUserDto } from '../presentation/dtos/auth-dto-response/auth-user.dto.js';
import { UserDtoEntityInfrastructure } from '../../user/infrastructure/dto/user.dto.js';

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const email = loginDto.getEmail();
    const password = loginDto.getPassword();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.getPassword());

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user);

    return this.buildAuthResponse(token, user);
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const email = registerDto.getEmail();

    const emailExists = await this.userRepository.existsByEmail(email);

    if (emailExists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.getPassword(), 10);

    const userEntity = new UserDtoEntityInfrastructure(
      registerDto.getName(),
      registerDto.getEmail(),
      registerDto.getPhone(),
      hashedPassword,
      registerDto.getRole(),
    );

    const savedUser = await this.userRepository.save(userEntity);

    const token = this.generateToken(savedUser);

    return this.buildAuthResponse(token, savedUser);
  }

  private generateToken(user: UserDtoEntityInfrastructure): string {
    const payload = {
      sub: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };

    return this.jwtService.sign(payload);
  }

  private buildAuthResponse(token: string, user: UserDtoEntityInfrastructure): AuthResponseDto {
    const authUser = new AuthUserDto(
      user.getId()!,
      user.getName(),
      user.getEmail(),
      user.getRole(),
    );

    return new AuthResponseDto(token, authUser);
  }
}
