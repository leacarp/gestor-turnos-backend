import { Controller, Post, Body, Get, UseGuards, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { IAuthService } from '../../domain/interfaces/auth-service.interface.js';
import { AUTH_SERVICE } from '../../infrastructure/constants/injection-tokens.js';
import { LoginRequestDto } from '../dtos/auth-dto-request/login-request.dto.js';
import { RegisterRequestDto } from '../dtos/auth-dto-request/register-request.dto.js';
import { AuthResponseDto } from '../dtos/auth-dto-response/auth-response.dto.js';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @ApiOperation({ summary: 'Inicia sesión con email y contraseña, devuelve un JWT' })
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Registra un nuevo usuario (cliente o proveedor)' })
  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devuelve los datos del usuario autenticado' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: { id: string; email: string; role: string }) {
    return user;
  }
}
