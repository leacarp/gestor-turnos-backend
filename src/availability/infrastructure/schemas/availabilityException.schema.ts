import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export class CustomSlot {
  startTime: string;
  endTime: string;
}

export type AvailabilityExceptionDocument = AvailabilityException & Document;

@Schema({timestamps : true})
export class AvailabilityException extends Document{
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId;

  @Prop({ required: true })
  date: Date; 

  @Prop({ enum: ['day_off', 'custom_hours'], required: true })
  type: 'day_off' | 'custom_hours';

  @Prop([{
    startTime: { type: String },
    endTime: { type: String },
  }])
  customSlots?: CustomSlot[];

  @Prop()
  reason?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const AvailabilityExceptionSchema = SchemaFactory.createForClass(AvailabilityException);
