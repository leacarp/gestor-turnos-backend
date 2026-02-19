import { UserDtoEntityInfrastructure } from "src/user/infrastructure/dto/user.dto";



export interface IUserRepository{
    save(dto: UserDtoEntityInfrastructure) : Promise<UserDtoEntityInfrastructure>;
    existsByEmail(email: string): Promise<boolean>;
}