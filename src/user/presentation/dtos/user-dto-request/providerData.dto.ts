import { IsString, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer'
import { SocialMediaDtoRequest } from './socialMedia.dto';
import { ProviderDataDtoService } from 'src/user/services/dto/user-dto.request/providerData-service.dto';


export class ProviderDataDtoRequest {
    @IsString()
    @IsNotEmpty()
    private readonly publicInfo : string;

    @IsString()
    @IsNotEmpty()
    private readonly address : string;

    @IsString()
    @IsNotEmpty()
    private readonly minimumAdvance : string;

    @IsString()
    @IsNotEmpty()
    private readonly serviceType : string;

    @ValidateNested()
    @Type(() => SocialMediaDtoRequest)
    @IsArray()
    @ArrayMinSize(1)
    private readonly socialMedia : SocialMediaDtoRequest[];

    constructor (publicInfo : string, address : string, minimumAdvance: string, serviceType: string, socialMedia: SocialMediaDtoRequest[]) {
        this.publicInfo = publicInfo;
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.socialMedia = socialMedia;
    }

    getPublicInfo() : string{
        return this.publicInfo;
    }

    getAddress() : string{
        return this.address;
    }

    getMinimumAdvance() : string{
        return this.minimumAdvance;
    }

    getServiceType() : string{
        return this.serviceType;
    }

    getSocialMedia() : SocialMediaDtoRequest[]{
        return this.socialMedia;
    }

    toServiceDto() : ProviderDataDtoService{
        return new ProviderDataDtoService(this.publicInfo, this.address, this.minimumAdvance, 
            this.serviceType, this.socialMedia.map(socialMedia => socialMedia.toServiceDto()))
    }


}