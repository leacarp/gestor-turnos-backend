import { IsString, IsNotEmpty } from 'class-validator';

export class SocialMediaRequestDto {
  @IsString()
  @IsNotEmpty()
  private readonly platform: string;

  @IsString()
  @IsNotEmpty()
  private readonly url: string;

  constructor(platform: string, url: string) {
    this.platform = platform;
    this.url = url;
  }

  getPlatform(): string { 
    return this.platform; 
  }

  getUrl(): string { 
    return this.url; 
  }
  
}