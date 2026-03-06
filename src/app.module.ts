import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AvailabilityModule } from './availability/availability.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongoDb'),
        dbName: configService.get<string>('dbName'),
      }),
    }),

    UserModule,
    AvailabilityModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

