export class SocialMediaResponseDto {
    platform: string;
    url: string;

    constructor(platform : string, url: string){
        this.platform = platform;
        this.url = url;
    }
}