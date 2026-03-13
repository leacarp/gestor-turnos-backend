import { Injectable, Inject } from '@nestjs/common';
import type { IAuthUserAdapter, AuthUserData, CreateAuthUserData } from '../../domain/interfaces/auth-user-adapter.interface.js';
import type { IUserRepository } from '../../../user/domain/interfaces/IUserRepository.js';
import type { IUserService } from '../../../user/services/interfaces/IUserService.js';
import { USER_REPOSITORY } from '../../../user/infrastructure/constants/user-repository.constants.js';
import { USER_SERVICE } from '../../../user/infrastructure/constants/user-service.constants.js';
import { UserEntity } from '../../../user/domain/entities/user.entity.js';
import { UserDtoService } from '../../../user/services/dto/user-dto.request/user-service.dto.js';
import { ProviderDataDtoService } from '../../../user/services/dto/user-dto.request/providerData-service.dto.js';
import { SocialMediaDtoService } from '../../../user/services/dto/user-dto.request/socialMedia-service.dto.js';

@Injectable()
export class UserRepositoryAdapter implements IAuthUserAdapter {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async findByEmail(email: string): Promise<AuthUserData | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    return this.toAuthUserData(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  async createUser(userData: CreateAuthUserData): Promise<AuthUserData> {
    const providerData = userData.providerData
      ? new ProviderDataDtoService(
          userData.providerData.address,
          userData.providerData.minimumAdvance,
          userData.providerData.serviceType,
          userData.providerData.publicInfo,
          userData.providerData.socialMedia?.map(
            s => new SocialMediaDtoService(s.platform, s.url),
          ),
        )
      : undefined;

    const serviceDto = new UserDtoService(
      userData.name,
      userData.email,
      userData.phone,
      userData.password,
      userData.role,
      providerData,
    );

    const savedUser = await this.userService.createUser(serviceDto);
    return this.toAuthUserData(savedUser);
  }

  private toAuthUserData(user: UserEntity): AuthUserData {
    return {
      id: user.getId()!,
      name: user.getName(),
      email: user.getEmail(),
      phone: user.getPhone(),
      password: user.getPassword(),
      role: user.getRole(),
    };
  }
}
