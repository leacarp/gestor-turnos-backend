import { SocialMediaResponseDto } from "src/user/presentation/dtos/user-dto-response/socialMedia.dto";

export class UpdateSocialMediaDtoEntity {
    private readonly platform?: string;
    private readonly url?: string;

    constructor(platform?: string, url?: string) {
        this.platform = platform;
        this.url = url;
    }

    getPlatform(): string | undefined { 
        return this.platform; 
    }

    getUrl(): string | undefined { 
        return this.url; 
    }

    toResponseDto(): SocialMediaResponseDto {
        return new SocialMediaResponseDto(
            this.platform || '',
            this.url || ''
        );
    }
}