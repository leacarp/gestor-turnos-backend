import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service.js';
import { MercadoPagoController } from './mercadopago.controller.js';
import { ServiciosModule } from '../servicios/servicios.module.js';
import { PagosModule } from '../pagos/pagos.module.js';
import { TurnosModule } from '../turnos/turnos.module.js';
import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    ServiciosModule,
    PagosModule,
    TurnosModule,
    UserModule,
    AuthModule,
  ],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
})
export class MercadoPagoModule {}
