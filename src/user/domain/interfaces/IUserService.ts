import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { UserResponseDto } from "src/user/presentation/dtos/user-dto-response/user.dto";
import { UpdateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-user.dto";


export interface IUserService{
    createUser(createUserDto: CreateUserDtoRequest) : Promise<UserResponseDto>;
    updateUser(userId: string, updateUserDtoRequest: UpdateUserDtoRequest): Promise<UserResponseDto>;
    deleteUser(userId: string) : Promise<{message: string}>;
    findOneUser(userId: string) : Promise<UserResponseDto>;
    findAllUser() : Promise<UserResponseDto[]>;
    existsProvider(providerId: string) : Promise<boolean>;
}