import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import { SocialMedia, SocialMediaSchema } from './socialMedia.schema';

export type ProviderDataDocument = ProviderData & Document;

@Schema({id: false})
export class ProviderData{
    @Prop({ required: false })
    publicInfo?: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    minimumAdvance?: number;

    @Prop({ required: true })
    serviceType: string;

    @Prop({ type: [SocialMediaSchema], required: false, default: [] })
    socialMedia: SocialMedia[];
}

export const ProviderDataSchema = SchemaFactory.createForClass(ProviderData);