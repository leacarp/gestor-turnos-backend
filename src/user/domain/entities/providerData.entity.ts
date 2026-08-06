import { SocialMediaLinkEntity } from "./socialMediaLink.entity"


export class ProviderDataEntity{
    private _publicInfo? : string;
    private _address : string;

    private _serviceType : string;
    private _socialMediaLink : SocialMediaLinkEntity[];

    // Mercado Pago OAuth (Marketplace)
    private _mpConnected: boolean;
    private _mpAccessToken?: string;
    private _mpRefreshToken?: string;
    private _mpUserId?: string;
    private _mpTokenExpiresAt?: Date;

    constructor (
        address : string,
        serviceType : string,

        publicInfo?: string,
        socialMediaLink?: SocialMediaLinkEntity[],
        mpConnected?: boolean,
        mpAccessToken?: string,
        mpRefreshToken?: string,
        mpUserId?: string,
        mpTokenExpiresAt?: Date,
    ){
        this._address = address;

        this._serviceType = serviceType;
        this._publicInfo = publicInfo;
        this._socialMediaLink = socialMediaLink ?? [];
        this._mpConnected = mpConnected ?? false;
        this._mpAccessToken = mpAccessToken;
        this._mpRefreshToken = mpRefreshToken;
        this._mpUserId = mpUserId;
        this._mpTokenExpiresAt = mpTokenExpiresAt;
    }

    getPublicInfo() : string | undefined {
        return this._publicInfo;
    }

    getAddress() : string{
        return this._address;
    }



    getServiceType() : string{
        return this._serviceType;
    }

    getSocialMediaLink() : SocialMediaLinkEntity[]{
        return this._socialMediaLink;
    }

    getMpConnected(): boolean {
        return this._mpConnected;
    }

    getMpAccessToken(): string | undefined {
        return this._mpAccessToken;
    }

    getMpRefreshToken(): string | undefined {
        return this._mpRefreshToken;
    }

    getMpUserId(): string | undefined {
        return this._mpUserId;
    }

    getMpTokenExpiresAt(): Date | undefined {
        return this._mpTokenExpiresAt;
    }
}