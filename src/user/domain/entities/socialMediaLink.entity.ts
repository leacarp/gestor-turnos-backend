export class SocialMediaLinkEntity{
    private _name : string
    private _url : string

    constructor(name: string, url: string){
        this._name = name;
        this._url= url;
    }

    getName() : string{
        return this._name;
    }

    getUrl() : string{
        return this._url;
    }

}