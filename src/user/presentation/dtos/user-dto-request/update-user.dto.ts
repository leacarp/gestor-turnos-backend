import { IsString, IsEmail, IsEnum, ValidateNested, IsOptional, MinLength, IsBoolean } from 'class-validator';
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

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoRequest,
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
   
    getProviderData(): UpdateProviderDataDtoRequest | undefined {
         return this.providerData; 
    }

    getIsActive() : boolean | undefined{
        return this.isActive;
    }
    
    toServiceDto(): UpdateUserDtoService {
        const providerDataService = this.providerData ? this.providerData.toServiceDto() : undefined;

        return new UpdateUserDtoService(
            this.name,
            this.email,
            this.phone,
            this.password,
            providerDataService, 
            this.isActive
        );
    }
}