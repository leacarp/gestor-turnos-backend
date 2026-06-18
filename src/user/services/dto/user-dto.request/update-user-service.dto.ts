import { UpdateProviderDataDtoService } from './update-providerData-service.dto';
import { ReminderSettingsEntity } from 'src/user/domain/entities/user.entity';

export class UpdateUserDtoService {
    private readonly name?: string;
    private readonly email?: string;
    private readonly phone?: string;
    private readonly password?: string;
    private readonly providerData?: UpdateProviderDataDtoService;
    private readonly isActive? : boolean;
    private readonly reminderSettings?: ReminderSettingsEntity;

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoService,
        isActive? : boolean,
        reminderSettings?: ReminderSettingsEntity
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
    
    getProviderData(): UpdateProviderDataDtoService | undefined { 
        return this.providerData; 
    }

    getIsActive() : boolean | undefined{
        return this.isActive;
    }

    getReminderSettings(): ReminderSettingsEntity | undefined {
        return this.reminderSettings;
    }

}