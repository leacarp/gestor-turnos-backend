import { SocialMediaResponseDto } from "./socialMedia.dto";

export class ProviderDataResponseDto {
    publicInfo: string;
    address: string;
    minimumAdvance: number;
    serviceType: string;
    socialMedia: SocialMediaResponseDto[];

    constructor(publicInfo: string, address: string, minimumAdvance: number, serviceType: string, socialMedia: SocialMediaResponseDto[]){
        this.publicInfo = publicInfo;
        this.address = address;
        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
        this.minimumAdvance = minimumAdvance;
    }
}