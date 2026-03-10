import { UserDtoService } from "../dto/user-dto.request/user-service.dto";
import { UpdateUserDtoService } from "../dto/user-dto.request/update-user-service.dto";

export interface IUserStrategy{
    validateCreate(user: UserDtoService): void;
    processCreation(user: UserDtoService): Promise<void>;

    validateUpdate(user: UpdateUserDtoService) : void;
    processUpdate(user: UpdateUserDtoService): Promise<void>;

    processDelete(userId: string): Promise<void>;
}