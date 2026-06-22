import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module.js';
import { Turno, TurnoSchema } from '../turnos/infrastructure/schemas/turno.schema.js';
import { Servicio, ServicioSchema } from '../servicios/infrastructure/schemas/servicio.schema.js';
import { User, UserSchema } from '../user/infrastructure/schemas/user.schema.js';
import { DashboardController } from './dashboard.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Turno.name,    schema: TurnoSchema    },
      { name: Servicio.name, schema: ServicioSchema },
      { name: User.name,     schema: UserSchema     },
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
