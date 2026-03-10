import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseStrategy } from "./baseStrategy";
import { UserDtoService } from "../dto/user-dto.request/user-service.dto";
import { UpdateUserDtoService } from "../dto/user-dto.request/update-user-service.dto";

@Injectable()
export class ClientStrategy extends BaseStrategy{

    validateCreate(user: UserDtoService): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        this.validatePassword(user.getPassword());

        this.ensureNoProviderData(user);
    }

    async processCreation(user: UserDtoService): Promise<void> {
        
    }

    validateUpdate(user: UpdateUserDtoService): void {
        this.validateUpdateBasicFields(user);

        if(user.getProviderData()){
            throw new Error('El cliente no puede tener información de provider');
        }
    }
    
    async processUpdate(user: UpdateUserDtoService): Promise<void> {
        
    }


    async processDelete(userId: string): Promise<void> {
        
    }


    private ensureNoProviderData(user: UserDtoService): asserts user is UserDtoService {
        if (user.getProviderData()) {
            throw new Error('Cliente no puede tener datos de provider');
        }
    }
    

}