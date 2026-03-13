import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from '../user/user.module.js';

import { AuthController } from './presentation/controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy.js';
import { UserRepositoryAdapter } from './infrastructure/adapters/user-repository.adapter.js';
import { AUTH_SERVICE, AUTH_USER_ADAPTER } from './infrastructure/constants/injection-tokens.js';


@Module({
  imports: [
    UserModule,

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_USER_ADAPTER,
      useClass: UserRepositoryAdapter,
    },
    JwtStrategy,
  ],
  exports: [AUTH_SERVICE, JwtModule, PassportModule],
})
export class AuthModule {}
