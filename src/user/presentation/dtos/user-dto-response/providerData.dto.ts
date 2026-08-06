import { SocialMediaResponseDto } from "./socialMedia.dto";

export class ProviderDataResponseDto {
    publicInfo?: string;
    address: string;
    serviceType: string;
    socialMedia: SocialMediaResponseDto[];
    mpConnected?: boolean;

    constructor(address: string, serviceType: string, publicInfo?: string, socialMedia?: SocialMediaResponseDto[], mpConnected?: boolean) {
        this.address = address;
        this.serviceType = serviceType;
        this.publicInfo = publicInfo;
        this.socialMedia = socialMedia ?? [];
        this.mpConnected = mpConnected;
    }
}
