import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserDtoService } from "../dto/user-dto.request/user-service.dto";
import { ProviderDataDtoService } from "../dto/user-dto.request/providerData-service.dto";
import { UpdateUserDtoService } from "../dto/user-dto.request/update-user-service.dto";
import { UpdateProviderDataDtoService } from "../dto/user-dto.request/update-providerData-service.dto";
import { UpdateSocialMediaDtoService } from "../dto/user-dto.request/updateSocialMedia-service.dto";
import { BaseStrategy } from "./baseStrategy";

@Injectable()
export class ProviderStrategy extends BaseStrategy{
    
    validateCreate(user: UserDtoService): void {
        this.validateName(user.getName());
        this.validateEmail(user.getEmail());
        this.validatePhone(user.getPhone());
        this.validatePassword(user.getPassword());
        
        const providerData = user.getProviderData();
        this.ensureProviderDataExistsCreate(providerData);
        this.validateProviderDataContentCreate(providerData);

    }

    async processCreation(user: UserDtoService): Promise<void> {
        
        
    }

    validateUpdate(user: UpdateUserDtoService): void {
        this.validateUpdateBasicFields(user);
        const providerData = user.getProviderData();
        if (providerData) {
            this.validateProviderDataContentUpdate(providerData);
        }
        
    }

    async processUpdate(user: UpdateUserDtoService): Promise<void> {
        
    }

    async processDelete(userId: string): Promise<void> {
        
        
    }
    
    private ensureProviderDataExistsCreate(providerData: ProviderDataDtoService | undefined): asserts providerData is ProviderDataDtoService {
        if (!providerData) {
            throw new BadRequestException('Provider debe tener información adicional');
        }
    }

    private validateProviderDataContentCreate(providerData: ProviderDataDtoService): void {
        if (!providerData.getSocialMedia() || providerData.getSocialMedia().length === 0) {
            throw new BadRequestException('Provider debe tener al menos una red social');
        }

        const publicInfo = providerData.getPublicInfo();
        if (!publicInfo || publicInfo.length < 20) {
            throw new BadRequestException('Información pública insuficiente (mínimo 20 caracteres)');
        }
    }

    private validateProviderDataContentUpdate(providerData: UpdateProviderDataDtoService): void {
        this.validateSocialMediaUpdate(providerData.getSocialMedia());
        this.validatePublicInfoUpdate(providerData.getPublicInfo());
    }

    private validateSocialMediaUpdate(socialMedia: UpdateSocialMediaDtoService[] | undefined): void {
        if (socialMedia !== undefined && socialMedia.length === 0) {
            throw new BadRequestException('Provider debe tener al menos una red social');
        }
    }

    private validatePublicInfoUpdate(publicInfo: string | undefined): void {
        if (publicInfo && publicInfo.length < 20) {
            throw new BadRequestException('Información pública insuficiente (mínimo 20 caracteres)');
        }
    }
}
