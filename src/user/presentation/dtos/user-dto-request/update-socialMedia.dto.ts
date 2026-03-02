import { IsString, IsOptional } from 'class-validator';
import { UpdateSocialMediaDtoService } from 'src/user/services/dto/user-dto.request/updateSocialMedia-service.dto';

export class UpdateSocialMediaDtoRequest {
    @IsString()
    @IsOptional()
    private readonly platform?: string;

    @IsString()
    @IsOptional()
    private readonly url?: string;

    constructor(platform?: string, url?: string) {
        this.platform = platform;
        this.url = url;
    }

    getPlatform(): string | undefined { 
        return this.platform; 
    }

    getUrl(): string | undefined { 
        return this.url; 
    }

    
    toServiceDto(): UpdateSocialMediaDtoService {
        return new UpdateSocialMediaDtoService(this.platform, this.url);
    }
}