import { ProviderDataDtoService } from './providerData-service.dto';
import { UserDtoEntityInfrastructure } from 'src/user/infrastructure/dto/user.dto';

export class UserDtoService {

    private readonly name : string;
    private readonly email : string;
    private readonly phone : string;
    private readonly password : string;
    private readonly role : string;
    private readonly providerData? : ProviderDataDtoService;
    private readonly createdAt? : Date;

    constructor(name: string, email: string, phone: string, password: string, role: string, providerData?: ProviderDataDtoService, createdAt? : Date){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.providerData = providerData;
        this.createdAt = createdAt;
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

    getCreatedAt() : Date | undefined{
        return this.createdAt;
    }

    toEntityDto(): UserDtoEntityInfrastructure {
        const providerDataEntity = this.providerData ? this.providerData.toEntityDto() : undefined;
        return new UserDtoEntityInfrastructure(
            this.name,
            this.email,
            this.phone,
            this.password,
            this.role,
            providerDataEntity,
            this.createdAt
        );
    }
}