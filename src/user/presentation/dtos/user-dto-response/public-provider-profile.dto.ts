import { ProviderDataResponseDto } from './providerData.dto';

export class PublicProviderProfileDto {
  id: string;
  name: string;
  providerData?: ProviderDataResponseDto;

  constructor(id: string, name: string, providerData?: ProviderDataResponseDto) {
    this.id = id;
    this.name = name;
    this.providerData = providerData;
  }
}
