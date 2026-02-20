import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { IUserStrategy } from "./userStrategy";


@Injectable()
export class AdminStrategy implements IUserStrategy{

    validate(user: CreateUserDtoRequest): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        this.ensureNoProviderData(user);
    }

    async processCreation(user: CreateUserDtoRequest): Promise<void> {
        
    }

    async processUpdate(user: CreateUserDtoRequest): Promise<void> {
        
    }


    async processDelete(userId: string): Promise<void> {
        
    }


    private validateName(nombre: string): void {
        if (!nombre || nombre.length < 3) {
            throw new NotFoundException('Nombre debe tener al menos 3 caracteres');
        }
    }

    private validateEmail(email: string): void {
        if (!email || !this.isValidEmail(email)) {
            throw new NotFoundException('Email inválido');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private validatePhone(phone : string) : void{
        if(!phone || phone.length < 11){
            throw new NotFoundException('El número debe tener cantidad correcta de dígitos');
        } 
    }

    private ensureNoProviderData(user: CreateUserDtoRequest): asserts user is CreateUserDtoRequest {
        if (user.getProviderData()) {
            throw new NotFoundException('Cliente no puede tener datos de provider');
        }
    }
    

}