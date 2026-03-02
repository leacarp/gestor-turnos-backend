import { IsString, IsEmail, IsEnum, ValidateNested, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDtoService } from 'src/user/services/dto/user-dto.request/update-user-service.dto';
import { UpdateProviderDataDtoRequest } from './update-providerData.dto';

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

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoRequest
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.providerData = providerData;
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

    
    toServiceDto(): UpdateUserDtoService {
        const providerDataService = this.providerData ? this.providerData.toServiceDto() : undefined;

        return new UpdateUserDtoService(
            this.name,
            this.email,
            this.phone,
            this.password,
            providerDataService
        );
    }
}