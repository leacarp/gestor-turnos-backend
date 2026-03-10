import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';

import { Servicio, ServicioSchema } from './infrastructure/schemas/servicio.schema.js';
import { ServicioController } from './presentation/controllers/servicio.controller.js';
import { ServicioService } from './services/servicio.service.js';
import { ServicioRepository } from './infrastructure/repositories/servicio.repository.js';
import { ProviderAdapter } from './infrastructure/adapters/provider.adapter.js';
import {
  SERVICIO_SERVICE,
  SERVICIO_REPOSITORY,
  SERVICIO_PROVIDER_ADAPTER,
} from './infrastructure/constants/injection-tokens.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Servicio.name, schema: ServicioSchema }]),
    UserModule,
    AuthModule,
  ],
  controllers: [ServicioController],
  providers: [
    {
      provide: SERVICIO_SERVICE,
      useClass: ServicioService,
    },
    {
      provide: SERVICIO_REPOSITORY,
      useClass: ServicioRepository,
    },
    {
      provide: SERVICIO_PROVIDER_ADAPTER,
      useClass: ProviderAdapter,
    },
  ],
  exports: [SERVICIO_SERVICE],
})
export class ServiciosModule {}
