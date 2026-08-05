import { IsString, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSocialMediaDtoRequest } from './update-socialMedia.dto';
import { UpdateProviderDataDtoService } from 'src/user/services/dto/user-dto.request/update-providerData-service.dto';

export class UpdateProviderDataDtoRequest {
    @IsString()
    @IsOptional()
    private readonly publicInfo?: string;

    @IsString()
    @IsOptional()
    private readonly address?: string;


    @IsString()
    @IsOptional()
    private readonly serviceType?: string;

    @Type(() => UpdateSocialMediaDtoRequest)
    @ValidateNested({ each: true })
    @IsArray()
    @IsOptional()
    private readonly socialMedia?: UpdateSocialMediaDtoRequest[];

    constructor(
        publicInfo?: string,
        address?: string,
        serviceType?: string,
        socialMedia?: UpdateSocialMediaDtoRequest[]
    ) {
        this.publicInfo = publicInfo;
        this.address = address;

        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
    }

    getPublicInfo(): string | undefined { 
        return this.publicInfo; 
    }

    getAddress(): string | undefined { 
        return this.address; 
    }


    getServiceType(): string | undefined { 
        return this.serviceType; 
    }

    getSocialMedia(): UpdateSocialMediaDtoRequest[] | undefined { 
        return this.socialMedia; 
    }

    
    toServiceDto(): UpdateProviderDataDtoService {
        const socialMediaService = this.socialMedia?.map(social => social.toServiceDto());

        return new UpdateProviderDataDtoService(
            this.publicInfo,
            this.address,

            this.serviceType,
            socialMediaService
        );
    }
}