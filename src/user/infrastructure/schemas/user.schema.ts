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
    enum: ['provider', 'user', 'admin'],
    default: 'user'
    })
    role: string;

    @Prop({ type: ProviderDataSchema, required: false})
    providerData?: ProviderData;

    createdAt?: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
