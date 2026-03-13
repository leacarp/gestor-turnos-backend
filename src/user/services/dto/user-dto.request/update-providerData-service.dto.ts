import { UpdateSocialMediaDtoService } from "./updateSocialMedia-service.dto";

export class UpdateProviderDataDtoService {
    private readonly publicInfo?: string;
    private readonly address?: string;
    private readonly minimumAdvance?: number;
    private readonly serviceType?: string;
    private readonly socialMedia?: UpdateSocialMediaDtoService[];

    constructor(
        publicInfo?: string,
        address?: string,
        minimumAdvance?: number,
        serviceType?: string,
        socialMedia?: UpdateSocialMediaDtoService[]
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

    getMinimumAdvance(): number | undefined { 
        return this.minimumAdvance; 
    }

    getServiceType(): string | undefined { 
        return this.serviceType; 
    }

    getSocialMedia(): UpdateSocialMediaDtoService[] | undefined { 
        return this.socialMedia; 
    }

}