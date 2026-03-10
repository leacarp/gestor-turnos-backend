import { ProviderDataDtoService } from './providerData-service.dto';

export class UserDtoService {

    private readonly name : string;
    private readonly email : string;
    private readonly phone : string;
    private readonly password : string;
    private readonly role : string;
    private readonly providerData? : ProviderDataDtoService;

    constructor(name: string, email: string, phone: string, password: string, role: string, providerData?: ProviderDataDtoService){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.providerData = providerData;
    }

    getName() : string{
        return this.name;
    }

    getEmail() : string{
        return this.email;
    }

    getPhone() : string{
        return this.phone;
    }

    getPassword() : string{
        return this.password;
    }

    getRole() : string{
        return this.role;
    }

    getProviderData() : ProviderDataDtoService | undefined{
        return this.providerData;
    }

}