import { Injectable, Inject } from '@nestjs/common';
import type { IUserAdapter } from '../../domain/interfaces/user-adapter.interface.js';
import type { IUserRepository } from '../../../user/domain/interfaces/IUserRepository.js';
import { USER_REPOSITORY } from '../../../user/infrastructure/constants/user-repository.constants.js';

@Injectable()
export class UserAdapter implements IUserAdapter {

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async existsProvider(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);

    return user !== null && user.getRole() === 'provider';
  }

  async existsClient(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);

    return user !== null && user.getRole() === 'client';
  }
}
