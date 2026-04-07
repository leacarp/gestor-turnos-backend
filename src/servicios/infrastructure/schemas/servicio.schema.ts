import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ServicioDocument = Servicio & Document;

@Schema({ timestamps: true })
export class Servicio {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  duracion: number;

  @Prop({ required: true })
  precio: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  proveedorId: Types.ObjectId;

  @Prop({ required: false, default: false })
  requiereSeña: boolean;

  @Prop({ required: false, default: 0, min: 0, max: 100 })
  porcentajeSeña: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ServicioSchema = SchemaFactory.createForClass(Servicio);
