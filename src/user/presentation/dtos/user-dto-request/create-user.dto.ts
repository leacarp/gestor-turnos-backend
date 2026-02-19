import { IsString, IsNotEmpty, IsEmail, IsEnum, ValidateNested, IsOptional, MinLength} from 'class-validator';
import { Type } from 'class-transformer';
import { ProviderDataDtoRequest } from './providerData.dto';
import { UserDtoService } from 'src/user/services/dto/user-dto.request/user-service.dto';

export class CreateUserDtoRequest {
    @IsString()
    @IsNotEmpty()
    private readonly name : string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    private readonly email : string;

    @IsString()
    @IsNotEmpty()
    private readonly phone : string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    private readonly password : string;

    @IsNotEmpty()
    @IsEnum(['provider', 'user', 'admin'])
    private readonly role : string;

    @ValidateNested()
    @Type(() => ProviderDataDtoRequest)
    @IsOptional()
    private readonly providerData? : ProviderDataDtoRequest;

    constructor(name: string, email: string, phone: string, password: string, role: string, providerData?: ProviderDataDtoRequest){
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

    getProviderData() : ProviderDataDtoRequest | undefined{
        return this.providerData;
    }

    toServiceDto() : UserDtoService{
        const providerDataService = this.providerData ? this.providerData.toServiceDto() : undefined;
        return new UserDtoService(this.name, this.email, this.phone, this.password, this.role, providerDataService)
    }



}