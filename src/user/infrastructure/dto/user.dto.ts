import { ProviderDataDtoEntity } from "./providerData.dto";
import { UserResponseDto } from "src/user/presentation/dtos/user-dto-response/user.dto";
import { ProviderDataResponseDto } from "src/user/presentation/dtos/user-dto-response/providerData.dto";

export class UserDtoEntityInfrastructure {
    private readonly id?: string;
    private readonly name: string;
    private readonly email: string;
    private readonly phone: string;
    private readonly password: string;
    private readonly role: string;
    private readonly providerData?: ProviderDataDtoEntity;
    private readonly createdAt? : Date;

    constructor(
        name: string,
        email: string,
        phone: string,
        password: string,
        role: string,
        providerData?: ProviderDataDtoEntity,
        createdAt? : Date,
        id?: string,
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.providerData = providerData;
        this.createdAt = createdAt;
    }

    getId() : string | undefined{
        return this.id;
    }

    getName(): string { 
        return this.name; 
    }
    getEmail(): string { 
        return this.email; 
    }
    getPhone(): string { 
        return this.phone; 
    }
    getPassword(): string { 
        return this.password; 
    }
    getRole(): string { 
        return this.role; 
    }
    getProviderData(): ProviderDataDtoEntity | undefined { 
        return this.providerData; 
    }

    getCreatedAt() : Date | undefined{
        return this.createdAt;
    }
    

    toResponseDto(): UserResponseDto {
        const providerDataResponse = this.providerData ? this.providerData.toResponseDto() : undefined;

        return new UserResponseDto(
            this.id!,
            this.name,
            this.email,
            this.phone,
            this.role,
            providerDataResponse,
            this.createdAt
        );
    }
}