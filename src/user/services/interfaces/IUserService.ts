import { UserDtoService } from "../dto/user-dto.request/user-service.dto";
import { UserEntity } from "src/user/domain/entities/user.entity";
import { UpdateUserDtoService } from "../dto/user-dto.request/update-user-service.dto";
import type { MpCredentialsData } from "../../domain/interfaces/IUserRepository";


export interface IUserService{
    createUser(dto: UserDtoService) : Promise<UserEntity>;
    updateUser(userId: string, updateUserDtoRequest: UpdateUserDtoService): Promise<UserEntity>;
    deleteUser(userId: string) : Promise<{message: string}>;
    findOneUser(userId: string) : Promise<UserEntity>;
    findAllUser() : Promise<UserEntity[]>;
    existsProvider(providerId: string) : Promise<boolean>;
    updateMpCredentials(userId: string, data: MpCredentialsData): Promise<void>;
    disconnectMpCredentials(userId: string): Promise<void>;
}