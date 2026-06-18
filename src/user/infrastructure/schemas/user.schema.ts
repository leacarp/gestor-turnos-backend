import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document} from 'mongoose';
import { ProviderData, ProviderDataSchema } from './providerData.schema';

export type UserDocument = User & Document;

export class ReminderSettingsWhatsapp {
    enabled: boolean;
    t24h: boolean;
    t2h: boolean;
}

export class ReminderSettingsEmail {
    enabled: boolean;
    t24h: boolean;
}

export class ReminderSettings {
    whatsapp: ReminderSettingsWhatsapp;
    email: ReminderSettingsEmail;
    messageTemplate: string;
}

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
    enum: ['provider', 'user', 'client', 'admin'],
    default: 'user'
    })
    role: string;

    @Prop({ type: ProviderDataSchema, required: false})
    providerData?: ProviderData;

    @Prop({
        type: {
            whatsapp: { enabled: Boolean, t24h: Boolean, t2h: Boolean },
            email: { enabled: Boolean, t24h: Boolean },
            messageTemplate: String,
        },
        required: false,
    })
    reminderSettings?: ReminderSettings;

    @Prop({ default: true })
    isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
