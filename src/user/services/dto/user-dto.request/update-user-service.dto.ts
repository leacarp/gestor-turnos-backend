import { UpdateProviderDataDtoService } from './update-providerData-service.dto';

export class UpdateUserDtoService {
    private readonly name?: string;
    private readonly email?: string;
    private readonly phone?: string;
    private readonly password?: string;
    private readonly providerData?: UpdateProviderDataDtoService;
    private readonly isActive? : boolean;

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoService,
        isActive? : boolean
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.providerData = providerData;
        this.isActive = isActive;
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

}