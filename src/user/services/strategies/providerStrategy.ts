import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/create-user.dto";
import { ProviderDataDtoRequest } from "src/user/presentation/dtos/user-dto-request/providerData.dto";
import { UpdateUserDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-user.dto";
import { UpdateProviderDataDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-providerData.dto";
import { UpdateSocialMediaDtoRequest } from "src/user/presentation/dtos/user-dto-request/update-socialMedia.dto";
import { BaseStrategy } from "./baseStrategy";

@Injectable()
export class ProviderStrategy extends BaseStrategy{
    
    validateCreate(user: CreateUserDtoRequest): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        this.validatePassword(user.getPassword());
        
        const providerData = user.getProviderData();
        this.ensureProviderDataExistsCreate(providerData);
        this.validateProviderDataContentCreate(providerData);

    }

    async processCreation(user: CreateUserDtoRequest): Promise<void> {
        
        
    }

    validateUpdate(user: UpdateUserDtoRequest): void {
        this.validateUpdateBasicFields(user);
        const providerData = user.getProviderData();
        if (providerData) {
            this.validateProviderDataContentUpdate(providerData);
        }
        
    }

    async processUpdate(user: UpdateUserDtoRequest): Promise<void> {
        
    }

    async processDelete(userId: string): Promise<void> {
        
        
    }
    
    private ensureProviderDataExistsCreate(providerData: ProviderDataDtoRequest | undefined): asserts providerData is ProviderDataDtoRequest {
        if (!providerData) {
            throw new NotFoundException('Provider debe tener información adicional');
        }
    }

    private validateProviderDataContentCreate(providerData: ProviderDataDtoRequest): void {
        if (providerData.getSocialMedia() && providerData.getSocialMedia().length === 0) {
            throw new NotFoundException('Provider debe tener al menos una red social');
        }

        const publicInfo = providerData.getPublicInfo();
        if (!publicInfo || publicInfo.length < 20) {
            throw new NotFoundException('Información pública insuficiente (mínimo 20 caracteres)');
        }
    }

    private validateProviderDataContentUpdate(providerData: UpdateProviderDataDtoRequest): void {
        this.validateSocialMediaUpdate(providerData.getSocialMedia());
        this.validatePublicInfoUpdate(providerData.getPublicInfo());
    }

    private validateSocialMediaUpdate(socialMedia: UpdateSocialMediaDtoRequest[] | undefined): void {
        if (socialMedia !== undefined && socialMedia.length === 0) {
            throw new NotFoundException('Provider debe tener al menos una red social');
        }
    }

    private validatePublicInfoUpdate(publicInfo: string | undefined): void {
        if (publicInfo && publicInfo.length < 20) {
            throw new NotFoundException('Información pública insuficiente (mínimo 20 caracteres)');
        }
    }
}
