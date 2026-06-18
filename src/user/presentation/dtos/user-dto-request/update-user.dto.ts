import { IsString, IsEmail, ValidateNested, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDtoService } from 'src/user/services/dto/user-dto.request/update-user-service.dto';
import { UpdateProviderDataDtoRequest } from './update-providerData.dto';
import type { ReminderSettingsEntity } from 'src/user/domain/entities/user.entity';

export class ReminderChannelWhatsappDto {
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsBoolean()
    t24h?: boolean;

    @IsOptional()
    @IsBoolean()
    t2h?: boolean;
}

export class ReminderChannelEmailDto {
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsBoolean()
    t24h?: boolean;
}

export class ReminderSettingsDtoRequest {
    @IsOptional()
    @ValidateNested()
    @Type(() => ReminderChannelWhatsappDto)
    whatsapp?: ReminderChannelWhatsappDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => ReminderChannelEmailDto)
    email?: ReminderChannelEmailDto;

    @IsOptional()
    @IsString()
    messageTemplate?: string;

    toEntity(): ReminderSettingsEntity {
        return {
            whatsapp: {
                enabled: this.whatsapp?.enabled ?? false,
                t24h: this.whatsapp?.t24h ?? false,
                t2h: this.whatsapp?.t2h ?? false,
            },
            email: {
                enabled: this.email?.enabled ?? false,
                t24h: this.email?.t24h ?? false,
            },
            messageTemplate: this.messageTemplate ?? '',
        };
    }
}

export class UpdateUserDtoRequest {
    @IsString()
    @IsOptional()
    @MinLength(3)
    private readonly name?: string;

    @IsEmail()
    @IsOptional()
    private readonly email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    private readonly phone?: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    private readonly password?: string;

    @ValidateNested()
    @Type(() => UpdateProviderDataDtoRequest)
    @IsOptional()
    private readonly providerData?: UpdateProviderDataDtoRequest;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => ReminderSettingsDtoRequest)
    reminderSettings?: ReminderSettingsDtoRequest;

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoRequest,
        isActive?: boolean,
        reminderSettings?: ReminderSettingsDtoRequest
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.providerData = providerData;
        this.isActive = isActive;
        this.reminderSettings = reminderSettings;
    }

    getName(): string | undefined {
        return this.name;
    }

    getEmail(): string | undefined {
        return this.email;
    }

    getPhone(): string | undefined {
        return this.phone;
    }

    getPassword(): string | undefined {
        return this.password;
    }

    getProviderData(): UpdateProviderDataDtoRequest | undefined {
        return this.providerData;
    }

    getIsActive(): boolean | undefined {
        return this.isActive;
    }

    getReminderSettings(): ReminderSettingsEntity | undefined {
        return this.reminderSettings ? this.reminderSettings.toEntity() : undefined;
    }

    toServiceDto(): UpdateUserDtoService {
        const providerDataService = this.providerData ? this.providerData.toServiceDto() : undefined;

        return new UpdateUserDtoService(
            this.name,
            this.email,
            this.phone,
            this.password,
            providerDataService,
            this.isActive,
            this.getReminderSettings()
        );
    }
}
