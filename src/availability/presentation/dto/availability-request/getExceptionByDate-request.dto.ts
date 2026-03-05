import { IsDateString, IsNotEmpty } from "class-validator";

export class GetExceptionByDateRequestDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}