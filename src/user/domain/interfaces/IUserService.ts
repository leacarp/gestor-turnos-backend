import { promises } from "dns";
import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { UserResponseDto } from "src/user/presentation/dtos/user-dto-response/user.dto";


export interface IUserService{
    createUser(createUserDto: CreateUserDtoRequest) : Promise<UserResponseDto>;
}