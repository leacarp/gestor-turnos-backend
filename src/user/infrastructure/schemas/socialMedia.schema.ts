import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';

export type SocialMediaDocument = SocialMedia & Document;

@Schema({id: false})
export class SocialMedia{
    @Prop({ required: true})
    platform: string

    @Prop({required: true})
    url: string
}

export const SocialMediaSchema = SchemaFactory.createForClass(SocialMedia);