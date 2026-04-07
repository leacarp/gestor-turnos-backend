import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pago, PagoSchema } from './infrastructure/schemas/pago.schema.js';
import { PagoRepository } from './infrastructure/repositories/pago.repository.js';
import { PagoService } from './services/pago.service.js';
import { PAGO_REPOSITORY, PAGO_SERVICE } from './infrastructure/constants/injection-tokens.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pago.name, schema: PagoSchema }]),
  ],
  providers: [
    { provide: PAGO_REPOSITORY, useClass: PagoRepository },
    { provide: PAGO_SERVICE, useClass: PagoService },
  ],
  exports: [PAGO_SERVICE],
})
export class PagosModule {}
