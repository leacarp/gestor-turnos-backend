import { SocialMediaLinkEntity } from "./socialMediaLink.entity"


export class ProviderDataEntity{
    private _publicInfo : string;
    private _address : string;
    private _minimumAdvance : number;
    private _serviceType : string;
    private _socialMediaLink : SocialMediaLinkEntity[];

    constructor (publicInfo : string, address : string, minimumAdvance : number, serviceType : string, socialMediaLink : SocialMediaLinkEntity[]){
        this._publicInfo = publicInfo;
        this._address = address;
        this._minimumAdvance = minimumAdvance;
        this._serviceType = serviceType;
        this._socialMediaLink = socialMediaLink;
    }

    getPublicInfo() : string{
        return this._publicInfo;
    }

    getAddress() : string{
        return this._address;
    }

    getMinimumAdvance() : number{
        return this._minimumAdvance;
    }

    getServiceType() : string{
        return this._serviceType;
    }

    getSocialMediaLink() : SocialMediaLinkEntity[]{
        return this._socialMediaLink;
    }


}