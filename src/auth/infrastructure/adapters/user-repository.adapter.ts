import { Injectable, Inject } from '@nestjs/common';
import type { IAuthUserAdapter, AuthUserData } from '../../domain/interfaces/auth-user-adapter.interface.js';
import type { IUserRepository } from '../../../user/domain/interfaces/IUserRepository.js';
import { USER_REPOSITORY } from '../../../user/infrastructure/constants/user-repository.constants.js';
import { UserEntity } from 'src/user/domain/entities/user.entity';

@Injectable()
export class UserRepositoryAdapter implements IAuthUserAdapter {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findByEmail(email: string): Promise<AuthUserData | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    return this.toAuthUserData(user); 
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
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
