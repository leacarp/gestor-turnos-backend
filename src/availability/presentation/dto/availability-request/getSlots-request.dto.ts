import { IsDateString, IsNotEmpty, IsMongoId } from 'class-validator';

export class GetSlotsRequestDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsMongoId()
  @IsNotEmpty()
  servicioId: string
}