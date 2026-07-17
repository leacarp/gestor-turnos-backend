import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PagoDocument = Pago & Document;

@Schema({ timestamps: true })
export class Pago {
  @Prop({ required: true })
  monto: number;

  @Prop({ required: true })
  montoTotal: number;

  @Prop({ required: true })
  porcentajeSeña: number;

  @Prop({
    required: true,
    enum: ['pendiente', 'aprobado', 'rechazado', 'cancelado'],
    default: 'pendiente',
  })
  estado: string;

  @Prop({ required: true })
  mpPaymentId: string;

  @Prop({ required: true })
  mpStatus: string;

  @Prop({ required: true })
  mpStatusDetail: string;

  @Prop({ required: true })
  mpExternalReference: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  proveedorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  clienteId?: Types.ObjectId;

  @Prop({ required: false })
  guestEmail?: string;

  @Prop({ type: Types.ObjectId, ref: 'Servicio', required: true })
  servicioId: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PagoSchema = SchemaFactory.createForClass(Pago);
