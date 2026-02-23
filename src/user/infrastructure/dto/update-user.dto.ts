import { UpdateProviderDataDtoEntity } from './update-providerData.dto';
import { UserResponseDto } from 'src/user/presentation/dtos/user-dto-response/user.dto';
import { UserDtoEntityInfrastructure } from 'src/user/infrastructure/dto/user.dto';

export class UpdateUserDtoEntity {
    private readonly name?: string;
    private readonly email?: string;
    private readonly phone?: string;
    private readonly password?: string;
    private readonly providerData?: UpdateProviderDataDtoEntity;

    constructor(
        name?: string,
        email?: string,
        phone?: string,
        password?: string,
        providerData?: UpdateProviderDataDtoEntity
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
    
    getProviderData(): UpdateProviderDataDtoEntity | undefined {
        return this.providerData; 
    }

    toResponseDto(currentUser: UserDtoEntityInfrastructure): UserResponseDto {
        const providerDataResponse = this.providerData ? this.providerData.toResponseDto() : currentUser.getProviderData()?.toResponseDto();;

        return new UserResponseDto(
            currentUser.getId()!,
            this.name || currentUser.getName(),
            this.email || currentUser.getEmail(),
            this.phone || currentUser.getPhone(),
            currentUser.getRole(),
            providerDataResponse,
            currentUser.getCreatedAt()
        );
    }
}