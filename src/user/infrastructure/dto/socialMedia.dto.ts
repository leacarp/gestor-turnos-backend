import { SocialMediaResponseDto } from "src/user/presentation/dtos/user-dto-response/socialMedia.dto";

export class SocialMediaDtoEntity {
    private readonly platform: string;
    private readonly url: string;

    constructor(platform: string, url: string) {
        this.platform = platform;
        this.url = url;
    }

    getPlatform(): string { 
        return this.platform;
    }

    getUrl(): string { 
        return this.url; 
    }

    toResponseDto(): SocialMediaResponseDto {
        return new SocialMediaResponseDto(this.platform, this.url);
    }
}