import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialMediaDtoRequest } from './socialMedia.dto';
import { ProviderDataDtoService } from 'src/user/services/dto/user-dto.request/providerData-service.dto';

export class ProviderDataDtoRequest {
    @IsOptional()
    @IsString()
    private readonly publicInfo?: string;

    @IsString()
    @IsNotEmpty()
    private readonly address: string;

    @IsNumber()
    @IsOptional()
    private readonly minimumAdvance?: number;

    @IsString()
    @IsNotEmpty()
    private readonly serviceType: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocialMediaDtoRequest)
    private readonly socialMedia?: SocialMediaDtoRequest[];

    constructor(address: string, serviceType: string, minimumAdvance?: number, publicInfo?: string, socialMedia?: SocialMediaDtoRequest[]) {
        this.address = address;
        this.minimumAdvance = minimumAdvance;
        this.serviceType = serviceType;
        this.publicInfo = publicInfo;
        this.socialMedia = socialMedia;
    }

    getPublicInfo(): string | undefined {
        return this.publicInfo;
    }

    getAddress(): string {
        return this.address;
    }

    getMinimumAdvance(): number | undefined{
        return this.minimumAdvance;
    }

    getServiceType(): string {
        return this.serviceType;
    }

    getSocialMedia(): SocialMediaDtoRequest[] | undefined {
        return this.socialMedia;
    }

    toServiceDto(): ProviderDataDtoService {
        return new ProviderDataDtoService(
            this.address,
            this.serviceType,
            this.minimumAdvance,
            this.publicInfo,
            this.socialMedia?.map(s => s.toServiceDto()),
        );
    }
}