import { SocialMediaDtoService } from './socialMedia-service.dto';

export class ProviderDataDtoService {

    private readonly publicInfo? : string;
    private readonly address : string;
    private readonly minimumAdvance : number;
    private readonly serviceType : string;
    private readonly socialMedia : SocialMediaDtoService[];

    constructor (address : string, minimumAdvance: number, serviceType: string, publicInfo?: string, socialMedia?: SocialMediaDtoService[]) {
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.publicInfo = publicInfo;
        this.socialMedia = socialMedia ?? [];
    }

    getPublicInfo() : string | undefined {
        return this.publicInfo;
    }

    getAddress() : string{
        return this.address;
    }

    getMinimumAdvance() : number{
        return this.minimumAdvance;
    }

    getServiceType() : string{
        return this.serviceType;
    }

    getSocialMedia() : SocialMediaDtoService[]{
        return this.socialMedia;
    }
}