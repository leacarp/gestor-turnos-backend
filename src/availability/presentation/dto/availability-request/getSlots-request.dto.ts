import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetSlotsRequestDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}