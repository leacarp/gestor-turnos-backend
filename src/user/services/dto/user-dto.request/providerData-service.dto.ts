import { ProviderDataDtoEntity } from 'src/user/infrastructure/dto/providerData.dto';
import { SocialMediaDtoService } from './socialMedia-service.dto';

export class ProviderDataDtoService {
   
    private readonly publicInfo : string;
    private readonly address : string;
    private readonly minimumAdvance : string;
    private readonly serviceType : string;
    private readonly socialMedia : SocialMediaDtoService[];

    constructor (publicInfo : string, address : string, minimumAdvance: string, serviceType: string, socialMedia: SocialMediaDtoService[]) {
        this.publicInfo = publicInfo;
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
    }

    getPublicInfo() : string{
        return this.publicInfo;
    }

    getAddress() : string{
        return this.address;
    }

    getMinimumAdvance() : string{
        return this.minimumAdvance;
    }

    getServiceType() : string{
        return this.serviceType;
    }

    getSocialMedia() : SocialMediaDtoService[]{
        return this.socialMedia;
    }

    toEntityDto(): ProviderDataDtoEntity {
        const socialMediaEntity = this.socialMedia.map(social => social.toEntityDto());
        return new ProviderDataDtoEntity(
            this.publicInfo,
            this.address,
            this.minimumAdvance,
            this.serviceType,
            socialMediaEntity
        );
    }

}