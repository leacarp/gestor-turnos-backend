import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialMediaRequestDto } from './socialMedia-request.dto';

export class ProviderDataRequestDto {
  @IsOptional()
  @IsString()
  private readonly publicInfo?: string;

  @IsString()
  @IsNotEmpty()
  private readonly address: string;

  @IsNumber()
  private readonly minimumAdvance: number;

  @IsString()
  @IsNotEmpty()
  private readonly serviceType: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaRequestDto)
  private readonly socialMedia?: SocialMediaRequestDto[];

  constructor(address: string, minimumAdvance: number, serviceType: string, publicInfo?: string, socialMedia?: SocialMediaRequestDto[]) {
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

  getMinimumAdvance(): number {
    return this.minimumAdvance;
  }

  getServiceType(): string {
    return this.serviceType;
  }

  getSocialMedia(): SocialMediaRequestDto[] | undefined {
    return this.socialMedia;
  }
}