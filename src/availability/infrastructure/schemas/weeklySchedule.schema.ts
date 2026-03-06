import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types} from 'mongoose';

export class DaySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export type WeeklyScheduleDocument = WeeklySchedule & Document;

@Schema({ timestamps: true })
export class WeeklySchedule extends Document{
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  providerId: Types.ObjectId;

  @Prop([{
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  }])
  slots: DaySlot[];

  createdAt: Date;
  updatedAt: Date;
}

export const WeeklyScheduleSchema = SchemaFactory.createForClass(WeeklySchedule);