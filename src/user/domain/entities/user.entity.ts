import { ProviderDataEntity } from "./providerData.entity";
import { SocialMediaLinkEntity } from "./socialMediaLink.entity";


export class UserEntity {
    private _id? : string;
    private _name : string;
    private _email : string;
    private _phone : string;
    private _password : string;
    private _role : string;
    private _providerData : ProviderDataEntity | undefined;
    private _socialMediaLink : SocialMediaLinkEntity[];
    private _createdAt: Date;
    private _updatedAt: Date;
    private _isActive : boolean;

    constructor(name: string, email: string, phone: string, password: string, role: string, providerData: ProviderDataEntity | undefined, socialMediaLink: SocialMediaLinkEntity[], createdAt: Date, updatedAt: Date, id?: string, isActive: boolean = true){
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._password = password;
        this._role = role;
        this._providerData = providerData;
        this._socialMediaLink = socialMediaLink;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._isActive = isActive;
        this._id = id;
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

    getProviderData() : ProviderDataEntity | undefined{
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

    getIsActive() : boolean{
        return this._isActive;
    }

    getId() : string | undefined{
        return this._id;
    }
}
