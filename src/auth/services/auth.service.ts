import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IAuthService } from '../domain/interfaces/auth-service.interface.js';
import type { IAuthUserAdapter, AuthUserData } from '../domain/interfaces/auth-user-adapter.interface.js';
import { AUTH_USER_ADAPTER } from '../infrastructure/constants/injection-tokens.js';
import { USER_SERVICE } from 'src/user/infrastructure/constants/user-service.constants';
import type { IUserService } from 'src/user/services/interfaces/IUserService.js';
import { UserDtoService } from 'src/user/services/dto/user-dto.request/user-service.dto';
import { LoginRequestDto } from '../presentation/dtos/auth-dto-request/login-request.dto';
import { RegisterRequestDto } from '../presentation/dtos/auth-dto-request/register-request.dto';
import { AuthResponseDto } from '../presentation/dtos/auth-dto-response/auth-response.dto';
import { AuthUserDto } from '../presentation/dtos/auth-dto-response/auth-user.dto';
import { ProviderDataDtoService } from 'src/user/services/dto/user-dto.request/providerData-service.dto';
import { SocialMediaDtoService } from 'src/user/services/dto/user-dto.request/socialMedia-service.dto';

@Injectable()
export class AuthService implements IAuthService {

  constructor(
    @Inject(AUTH_USER_ADAPTER)
    private readonly userAdapter: IAuthUserAdapter,
    @Inject(USER_SERVICE)
    private readonly userService : IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userAdapter.findByEmail(loginDto.getEmail());
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    
    const isPasswordValid = await bcrypt.compare(loginDto.getPassword(), user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const token = this.generateToken(user);
    return this.buildAuthResponse(token, user);
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const providerData = registerDto.getProviderData()
    ? new ProviderDataDtoService(
        registerDto.getProviderData()!.getPublicInfo(),
        registerDto.getProviderData()!.getAddress(),
        registerDto.getProviderData()!.getMinimumAdvance(),
        registerDto.getProviderData()!.getServiceType(),
        registerDto.getProviderData()!.getSocialMedia()?.map(s =>
          new SocialMediaDtoService(s.getPlatform(), s.getUrl())
        ) ?? [],
      )
    : undefined;

    const serviceDto = new UserDtoService(
      registerDto.getName(),
      registerDto.getEmail(),
      registerDto.getPhone(),
      registerDto.getPassword(), 
      registerDto.getRole(),
      providerData
    );

    const savedUser = await this.userService.createUser(serviceDto);
    const token = this.generateToken({
      id: savedUser.getId()!,
      name: savedUser.getName(),
      email: savedUser.getEmail(),
      phone: savedUser.getPhone(),
      password: savedUser.getPassword(),
      role: savedUser.getRole(),
    });

    return this.buildAuthResponse(token, {
      id: savedUser.getId()!,
      name: savedUser.getName(),
      email: savedUser.getEmail(),
      phone: savedUser.getPhone(),
      password: savedUser.getPassword(),
      role: savedUser.getRole(),
    });
  }

  private generateToken(user: AuthUserData): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private buildAuthResponse(token: string, user: AuthUserData): AuthResponseDto {
    const authUser = new AuthUserDto(user.id, user.name, user.email, user.role);
    return new AuthResponseDto(token, authUser);
  }

}
