import { IsDateString, IsEnum, IsOptional, IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class CustomSlotRequestDto {
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class AvailabilityExceptionRequestDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(['day_off', 'custom_hours'])
  type: 'day_off' | 'custom_hours';

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSlotRequestDto)
  customSlots?: CustomSlotRequestDto[];

  @IsOptional()
  @IsString()
  reason?: string;
}