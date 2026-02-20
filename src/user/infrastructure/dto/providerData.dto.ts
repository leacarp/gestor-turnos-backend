import { SocialMediaDtoEntity } from "./socialMedia.dto";
import { ProviderDataResponseDto } from "src/user/presentation/dtos/user-dto-response/providerData.dto";

export class ProviderDataDtoEntity {
    private readonly publicInfo: string;
    private readonly address: string;
    private readonly minimumAdvance: string;
    private readonly serviceType: string;
    private readonly socialMedia: SocialMediaDtoEntity[];

    constructor(publicInfo: string, address: string, minimumAdvance: string, serviceType: string, socialMedia: SocialMediaDtoEntity[]) {
        this.publicInfo = publicInfo;
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
    }

    getPublicInfo(): string { 
        return this.publicInfo;
    }
    getAddress(): string { 
        return this.address;
    }
    getMinimumAdvance(): string { 
        return this.minimumAdvance; 
    }
    getServiceType(): string { 
        return this.serviceType; 
    }
    getSocialMedia(): SocialMediaDtoEntity[] { 
        return this.socialMedia; 
    }

    toResponseDto(): ProviderDataResponseDto {
        const socialMediaResponse = this.socialMedia.map(social => social.toResponseDto());
        return new ProviderDataResponseDto(
            this.publicInfo,
            this.address,
            this.minimumAdvance,
            this.serviceType,
            socialMediaResponse
        );
    }
}