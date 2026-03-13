import { SocialMediaLinkEntity } from "./socialMediaLink.entity"


export class ProviderDataEntity{
    private _publicInfo? : string;
    private _address : string;
    private _minimumAdvance? : number;
    private _serviceType : string;
    private _socialMediaLink : SocialMediaLinkEntity[];

    constructor (address : string, serviceType : string, minimumAdvance? : number, publicInfo?: string, socialMediaLink?: SocialMediaLinkEntity[]){
        this._address = address;
        this._minimumAdvance = minimumAdvance;
        this._serviceType = serviceType;
        this._publicInfo = publicInfo;
        this._socialMediaLink = socialMediaLink ?? [];
    }

    getPublicInfo() : string | undefined {
        return this._publicInfo;
    }

    getAddress() : string{
        return this._address;
    }

    getMinimumAdvance() : number | undefined{
        return this._minimumAdvance;
    }

    getServiceType() : string{
        return this._serviceType;
    }

    getSocialMediaLink() : SocialMediaLinkEntity[]{
        return this._socialMediaLink;
    }
}