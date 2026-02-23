import { UpdateSocialMediaDtoEntity } from "./updateSocialMedia.dto";
import { ProviderDataResponseDto } from "src/user/presentation/dtos/user-dto-response/providerData.dto";

export class UpdateProviderDataDtoEntity {
    private readonly publicInfo?: string;
    private readonly address?: string;
    private readonly minimumAdvance?: string;
    private readonly serviceType?: string;
    private readonly socialMedia?: UpdateSocialMediaDtoEntity[];

    constructor(
        publicInfo?: string,
        address?: string,
        minimumAdvance?: string,
        serviceType?: string,
        socialMedia?: UpdateSocialMediaDtoEntity[]
    ) {
        this.publicInfo = publicInfo;
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
    }

    getPublicInfo(): string | undefined { 
        return this.publicInfo;
    }

    getAddress(): string | undefined { 
        return this.address; 
    }

    getMinimumAdvance(): string | undefined { 
        return this.minimumAdvance; 
    }

    getServiceType(): string | undefined { 
        return this.serviceType; 
    }
    
    getSocialMedia(): UpdateSocialMediaDtoEntity[] | undefined { 
        return this.socialMedia; 
    }

    toResponseDto(): ProviderDataResponseDto {
        const socialMediaResponse = this.socialMedia?.map(social => 
            social.toResponseDto()
        ) || [];

        return new ProviderDataResponseDto(
            this.publicInfo || '',
            this.address || '',
            this.minimumAdvance || '',
            this.serviceType || '',
            socialMediaResponse
        );
    }
}