import { ProviderDataEntity } from "./providerData.entity";
import { SocialMediaLinkEntity } from "./socialMediaLink.entity";


export class UserEntity {
    private _name : string
    private _email : string
    private _phone : string
    private _password : string
    private _role : string
    private _providerData : ProviderDataEntity
    private _socialMediaLink : SocialMediaLinkEntity[]
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(name: string, email: string, phone: string, password: string, role: string, providerData: ProviderDataEntity, socialMediaLink: SocialMediaLinkEntity[], createdAt: Date, updatedAt: Date){
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._password = password;
        this._role = role;
        this._providerData = providerData;
        this._socialMediaLink = socialMediaLink;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    getName() : string{
        return this._name;
    }

    getEmail() : string{
        return this._email;
    }

    getPhone() : string{
        return this._phone;
    }

    getPassword() : string{
        return this._password;
    }

    getRole() : string{
        return this._role;
    }

    getProviderData() : ProviderDataEntity{
        return this._providerData;
    }

    getSocialMediaLink() : SocialMediaLinkEntity[]{
        return this._socialMediaLink;
    }

    getCreatedAt() : Date{
        return this._createdAt;
    }

    getUpdatedAt() : Date{
        return this._updatedAt;
    }
}
