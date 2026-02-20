import { IsString, IsNotEmpty } from 'class-validator';
import { SocialMediaDtoService } from 'src/user/services/dto/user-dto.request/socialMedia-service.dto';

export class SocialMediaDtoRequest {
    @IsString()
    @IsNotEmpty()
    private readonly platform : string;

    @IsString()
    @IsNotEmpty()
    private readonly url : string;

    constructor(platform: string, url: string){
        this.platform = platform;
        this.url = url;
    }

    getPlatform() : string{
        return this.platform;
    }

    getUrl() : string{
        return this.url;
    }

    toServiceDto() : SocialMediaDtoService{
        return new SocialMediaDtoService(this.platform, this.url)
    }

}