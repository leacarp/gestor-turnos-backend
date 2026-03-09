export class SocialMediaDtoService {

    private readonly platform : string;
    private readonly url : string;

    constructor(platform: string, url: string){
        this.platform = platform;
        this.url = url;
    }

    getPlatform() : string{
        return this.platform;
    }

    getUrl() : string{
        return this.url;
    }
}