import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { BaseStrategy } from "./baseStrategy";
import { UpdateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-user.dto";


@Injectable()
export class ClientStrategy extends BaseStrategy{

    validateCreate(user: CreateUserDtoRequest): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        this.validatePassword(user.getPassword());

        this.ensureNoProviderData(user);
    }

    async processCreation(user: CreateUserDtoRequest): Promise<void> {
        
    }

    validateUpdate(user: UpdateUserDtoRequest): void {
        this.validateUpdateBasicFields(user);

        if(user.getProviderData()){
            throw new NotFoundException('El cliente no puede tener información de provider');
        }
    }
    
    async processUpdate(user: UpdateUserDtoRequest): Promise<void> {
        
    }


    async processDelete(userId: string): Promise<void> {
        
    }


    private ensureNoProviderData(user: CreateUserDtoRequest): asserts user is CreateUserDtoRequest {
        if (user.getProviderData()) {
            throw new NotFoundException('Cliente no puede tener datos de provider');
        }
    }
    

}