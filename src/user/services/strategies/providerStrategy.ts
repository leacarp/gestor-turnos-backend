import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { IUserStrategy } from "./userStrategy";
import { ProviderDataDtoRequest } from "src/user/presentation/dtos/user-dto-request/providerData.dto";

@Injectable()
export class ProviderStrategy implements IUserStrategy{
    validate(user: CreateUserDtoRequest): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        
        const providerData = user.getProviderData();
        this.ensureProviderDataExists(providerData);
        this.validateProviderDataContent(providerData);
        const publicInfo = providerData.getPublicInfo();
        this.validDocumentation(publicInfo);
    }

    async processCreation(user: CreateUserDtoRequest): Promise<void> {
        
        
    }

    async processUpdate(user: CreateUserDtoRequest): Promise<void> {
        
    }

    async processDelete(userId: string): Promise<void> {
        
    }
    
    private ensureProviderDataExists(providerData: ProviderDataDtoRequest | undefined): asserts providerData is ProviderDataDtoRequest {
        if (!providerData) {
            throw new NotFoundException('Provider debe tener información adicional');
        }
    }
    private validateProviderDataContent(providerData: ProviderDataDtoRequest): void {
        if (providerData.getSocialMedia().length === 0) {
            throw new NotFoundException('Provider debe tener al menos una red social');
        }
    }

    private validDocumentation(publicInfo : string): void{
        if (!publicInfo || publicInfo.length < 20) {
            throw new NotFoundException('Documentación insuficiente');
        }
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

}