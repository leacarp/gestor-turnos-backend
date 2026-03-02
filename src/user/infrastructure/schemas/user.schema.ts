import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import { ProviderData, ProviderDataSchema } from './providerData.schema';

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User{
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({required: true, unique: true})
    phone: string;

    @Prop({ 
    required: true, 
    enum: ['provider', 'client', 'admin'],
    default: 'user'
    })
    role: string;

    @Prop({ type: ProviderDataSchema, required: false})
    providerData?: ProviderData;

    @Prop({ default: true })
    isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
