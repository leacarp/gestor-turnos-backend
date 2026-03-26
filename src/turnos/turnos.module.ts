import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ServiciosModule } from '../servicios/servicios.module.js';

import { Turno, TurnoSchema } from './infrastructure/schemas/turno.schema.js';
import { TurnoController } from './presentation/controllers/turno.controller.js';
import { TurnoService } from './services/turno.service.js';
import { TurnoRepository } from './infrastructure/repositories/turno.repository.js';
import { UserAdapter } from './infrastructure/adapters/user.adapter.js';
import { ServicioAdapter } from './infrastructure/adapters/servicio.adapter.js';
import {
  TURNO_SERVICE,
  TURNO_REPOSITORY,
  TURNO_USER_ADAPTER,
  TURNO_SERVICIO_ADAPTER,
} from './infrastructure/constants/injection-tokens.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Turno.name, schema: TurnoSchema }]),
    UserModule,
    AuthModule,
    ServiciosModule,
  ],
  controllers: [TurnoController],
  providers: [
    {
      provide: TURNO_SERVICE,
      useClass: TurnoService,
    },
    {
      provide: TURNO_REPOSITORY,
      useClass: TurnoRepository,
    },
    {
      provide: TURNO_USER_ADAPTER,
      useClass: UserAdapter,
    },
    {
      provide: TURNO_SERVICIO_ADAPTER,
      useClass: ServicioAdapter,
    },
  ],
  exports: [TURNO_SERVICE],
})
export class TurnosModule {}
