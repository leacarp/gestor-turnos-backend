import { Injectable, Inject } from '@nestjs/common';
import type { IProviderAdapter, ProviderData } from '../../domain/interfaces/provider-adapter.interface.js';
import type { IUserRepository } from '../../../user/domain/interfaces/IUserRepository.js';
import { USER_REPOSITORY } from '../../../user/infrastructure/constants/user-repository.constants.js';

@Injectable()
export class ProviderAdapter implements IProviderAdapter {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async findById(id: string): Promise<ProviderData | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return {
      id: user.getId()!,
      name: user.getName(),
      role: user.getRole(),
    };
  }

  async isProvider(id: string): Promise<boolean> {
    const user = await this.findById(id);

    return user !== null && user.role === 'provider';
  }
}
