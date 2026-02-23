import { UpdateSocialMediaDtoEntity } from "src/user/infrastructure/dto/updateSocialMedia.dto";

export class UpdateSocialMediaDtoService {
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

    toEntityDto(): UpdateSocialMediaDtoEntity {
        return new UpdateSocialMediaDtoEntity(this.platform, this.url);
    }
}