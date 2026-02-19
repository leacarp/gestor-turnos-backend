import { SocialMediaDtoEntity } from "src/user/infrastructure/dto/socialMedia.dto";

export class SocialMediaDtoService {

    private readonly platform : string;
    private readonly url : string;

    constructor(platform: string, url: string){
        this.platform = platform;
        this.url = url;
    }

    getName() : string{
        return this.platform;
    }

    getUrl() : string{
        return this.url;
    }

    toEntityDto(): SocialMediaDtoEntity {
        return new SocialMediaDtoEntity(this.platform, this.url);
    }
}