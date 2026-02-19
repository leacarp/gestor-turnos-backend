import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
//revisar el dto este, creo que es el de service y no el de presentation

export interface IUserStrategy{
    validate(user: CreateUserDtoRequest): void;
    processCreation(user: CreateUserDtoRequest): Promise<void>;
    processUpdate(user: CreateUserDtoRequest): Promise<void>;
    processDelete(userId: string): Promise<void>;
}