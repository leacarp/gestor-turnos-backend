export class SocialMediaLinkEntity{
    private _platform : string
    private _url : string

    constructor(platform: string, url: string){
        this._platform = platform;
        this._url= url;
    }

    getPlatform() : string{
        return this._platform;
    }

    getUrl() : string{
        return this._url;
    }

}