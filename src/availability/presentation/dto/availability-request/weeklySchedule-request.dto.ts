import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class DaySlotRequestDto {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsBoolean()
  isActive: boolean;
}

export class WeeklyScheduleRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DaySlotRequestDto)
  slots: DaySlotRequestDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  appointmentGap?: number;
}