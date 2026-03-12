import { SocialMediaResponseDto } from "./socialMedia.dto";

export class ProviderDataResponseDto {
    publicInfo?: string;
    address: string;
    minimumAdvance: number;
    serviceType: string;
    socialMedia: SocialMediaResponseDto[];

    constructor(address: string, minimumAdvance: number, serviceType: string, publicInfo?: string, socialMedia?: SocialMediaResponseDto[]) {
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.publicInfo = publicInfo;
        this.socialMedia = socialMedia ?? [];
    }
}