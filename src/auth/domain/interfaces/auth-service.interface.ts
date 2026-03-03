import { LoginRequestDto } from '../../presentation/dtos/auth-dto-request/login-request.dto.js';
import { RegisterRequestDto } from '../../presentation/dtos/auth-dto-request/register-request.dto.js';
import { AuthResponseDto } from '../../presentation/dtos/auth-dto-response/auth-response.dto.js';

export interface IAuthService {
  login(loginDto: LoginRequestDto): Promise<AuthResponseDto>;
  register(registerDto: RegisterRequestDto): Promise<AuthResponseDto>;
}
