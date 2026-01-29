import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),

    MongooseModule.forRoot(process.env.MONGODB || '', {
      dbName: 'gestorTurnos',
    }),

    UserModule,

   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
