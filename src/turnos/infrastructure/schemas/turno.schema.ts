import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TurnoDocument = Turno & Document;

@Schema({ timestamps: true })
export class Turno {
  @Prop({ type: Date, required: true })
  fecha: Date;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({
    required: true,
    enum: ['pendiente', 'confirmado', 'cancelado', 'completado'],
    default: 'pendiente',
  })
  estado: string;

  @Prop({ required: false })
  notas?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  proveedorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Servicio', required: true })
  servicioId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clienteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pago', required: false })
  pagoId?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TurnoSchema = SchemaFactory.createForClass(Turno);
