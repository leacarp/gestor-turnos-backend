import { Expose } from 'class-transformer';
import { AuthUserDto } from './auth-user.dto.js';

export class AuthResponseDto {
  @Expose()
  readonly accessToken: string;

  @Expose()
  readonly user: AuthUserDto;

  constructor(accessToken: string, user: AuthUserDto) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
