import { SocialMediaResponseDto } from "./socialMedia.dto";

export class ProviderDataResponseDto {
    publicInfo?: string;
    address: string;
    minimumAdvance?: number;
    serviceType: string;
    socialMedia: SocialMediaResponseDto[];

    constructor(address: string, serviceType: string, minimumAdvance?: number, publicInfo?: string, socialMedia?: SocialMediaResponseDto[]) {
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.publicInfo = publicInfo;
        this.socialMedia = socialMedia ?? [];
    }
}