import { Expose } from "class-transformer";
import { ProviderDataResponseDto } from "./providerData.dto";

export class UserResponseDto{

    @Expose()
    id : string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    phone: string;

    @Expose()
    role : string;

    @Expose()
    providerData?: ProviderDataResponseDto;

    @Expose()
    createdAt?: Date;
    

    constructor(id : string,name: string, email: string, phone: string, role : string ,providerData?: ProviderDataResponseDto, createdAt?: Date){
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.providerData = providerData;
        this.createdAt = createdAt;
    }

   
}