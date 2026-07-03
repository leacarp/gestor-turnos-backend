import { IsDateString } from 'class-validator';

export class CancelarDiaRequestDto {
  @IsDateString()
  fecha: string;

  parseLocalDate(): Date {
    return new Date(this.fecha + 'T00:00:00');
  }
}
