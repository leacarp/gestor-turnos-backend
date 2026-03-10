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

}