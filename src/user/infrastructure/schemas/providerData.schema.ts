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
    serviceType: string;

    @Prop({ type: [SocialMediaSchema], required: false, default: [] })
    socialMedia: SocialMedia[];

    @Prop({ required: false, default: false })
    mpConnected: boolean;

    @Prop({ required: false })
    mpAccessToken?: string;

    @Prop({ required: false })
    mpRefreshToken?: string;

    @Prop({ required: false })
    mpUserId?: string;

    @Prop({ required: false })
    mpTokenExpiresAt?: Date;
}

export const ProviderDataSchema = SchemaFactory.createForClass(ProviderData);