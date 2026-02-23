import { UserDtoEntityInfrastructure } from "src/user/infrastructure/dto/user.dto";
import { UpdateUserDtoEntity } from "src/user/infrastructure/dto/update-user.dto";


export interface IUserRepository{
    save(dto: UserDtoEntityInfrastructure) : Promise<UserDtoEntityInfrastructure>;
    existsByEmail(email: string): Promise<boolean>;
    findById(id: string): Promise<UserDtoEntityInfrastructure | null>;
    updateUser(id: string, updateUserDtoEntity: UpdateUserDtoEntity): Promise<UserDtoEntityInfrastructure>
}