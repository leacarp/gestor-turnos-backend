import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { UpdateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-user.dto";

export interface IUserStrategy{
    validateCreate(user: CreateUserDtoRequest): void;
    processCreation(user: CreateUserDtoRequest): Promise<void>;

    validateUpdate(user: UpdateUserDtoRequest) : void;
    processUpdate(user: UpdateUserDtoRequest): Promise<void>;

    processDelete(userId: string): Promise<void>;
}