import { Controller, Get, Post, Delete, Body, Param, Query, Inject, Put } from '@nestjs/common';
import type { IAvailabilityService } from '../services/interfaces/IAvailabilityService';
import { WeeklyScheduleEntity } from '../domain/entities/weeklySchedule.entity';
import { AvailabilityExceptionEntity } from '../domain/entities/availabilityException.entity';
import { WeeklyScheduleRequestDto } from './dto/availability-request/weeklySchedule-request.dto';
import { AvailabilityExceptionRequestDto } from './dto/availability-request/availabilityException-request.dto';
import { GetSlotsRequestDto } from './dto/availability-request/getSlots-request.dto';
import { GetExceptionByDateRequestDto } from './dto/availability-request/getExceptionByDate-request.dto';
import { WeeklyScheduleResponseDto } from './dto/availability-response/weeklySchedule-response.dto';
import { AvailabilityExceptionResponseDto } from './dto/availability-response/availabilityException-response.dto';
import { AvailableSlotResponseDto } from './dto/availability-response/availableSlots-response.dto';
import { WeeklyScheduleDtoService } from '../services/dto/availability-dto.request/weeklySchedule-service.dto';
import { AvailabilityExceptionDtoService } from '../services/dto/availability-dto.request/availabilityException-service.dto';
import { GetSlotsDtoService } from '../services/dto/availability-dto.request/getSlots-service.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(
    @Inject('IAvailabilityService') private readonly availabilityService: IAvailabilityService,
  ) {}

  // --- Weekly Schedule ---
  
  @Post('schedule/:providerId')
  async createSchedule(@Param('providerId') providerId: string, @Body() dto: WeeklyScheduleRequestDto): Promise<WeeklyScheduleResponseDto> {
    const serviceDto = new WeeklyScheduleDtoService(providerId, dto.slots);
    const entity = await this.availabilityService.createSchedule(serviceDto);
    return this.toWeeklyScheduleResponse(entity);
  }
    
  @Get('schedule/:providerId')
  async getSchedule(@Param('providerId') providerId: string): Promise<WeeklyScheduleResponseDto> {
    const entity = await this.availabilityService.getSchedule(providerId);
    return this.toWeeklyScheduleResponse(entity);
  }
    
  @Put('schedule/:providerId')
  async updateSchedule(@Param('providerId') providerId: string,@Body() dto: WeeklyScheduleRequestDto): Promise<WeeklyScheduleResponseDto> {
    const serviceDto = new WeeklyScheduleDtoService(providerId, dto.slots);
    const entity = await this.availabilityService.updateSchedule(providerId, serviceDto);
    return this.toWeeklyScheduleResponse(entity);
  }
    
    // --- Exceptions ---
    
  @Post('exceptions/:providerId')
  async createException(@Param('providerId') providerId: string, @Body() dto: AvailabilityExceptionRequestDto): Promise<AvailabilityExceptionResponseDto> {
    const serviceDto = new AvailabilityExceptionDtoService(
        providerId,
        new Date(dto.date + 'T00:00:00'),
        dto.type,
        dto.customSlots,
        dto.reason,
    );
    const entity = await this.availabilityService.createException(serviceDto);
    return this.toExceptionResponse(entity);
  }
    
  @Get('exceptions/:providerId')
  async getExceptionsByMonth(@Param('providerId') providerId: string, @Query('year') year: string, @Query('month') month: string): Promise<AvailabilityExceptionResponseDto[]> {
    const entities = await this.availabilityService.getExceptionsByMonth(
        providerId,
        parseInt(year),
        parseInt(month),
    );
    return entities.map(entity => this.toExceptionResponse(entity));
  }
  
  @Get('exceptions/:providerId/date')
  async findExceptionByDate(@Param('providerId') providerId: string, @Query() query: GetExceptionByDateRequestDto): Promise<AvailabilityExceptionResponseDto | null> {
    const entity = await this.availabilityService.getExceptionsByDate(
      providerId,
      new Date(query.date),
    );
    return entity ? this.toExceptionResponse(entity) : null;
  }



  @Delete('exceptions/:exceptionId')
  async deleteException(@Param('exceptionId') exceptionId: string): Promise<{ message: string }> {
    await this.availabilityService.deleteException(exceptionId);
    return { message: 'Exception deleted successfully' };
  }
    
    // --- Available Slots ---
    
  @Get('slots/:providerId')
  async getAvailableSlots(@Param('providerId') providerId: string, @Query() query: GetSlotsRequestDto): Promise<AvailableSlotResponseDto[]> {
    const date = new Date(query.date + 'T00:00:00');
    const serviceDto = new GetSlotsDtoService(providerId, date);
    return this.availabilityService.getAvailableSlots(serviceDto);
  }
    
    
  private toWeeklyScheduleResponse(entity: WeeklyScheduleEntity): WeeklyScheduleResponseDto {
    return {
        id: entity.getId()!,
        providerId: entity.getProviderId(),
        slots: entity.getSlots(),
        createdAt: entity.getCreatedAt()!,
        updatedAt: entity.getUpdatedAt()!,
    };
  }
    
  private toExceptionResponse(entity: AvailabilityExceptionEntity): AvailabilityExceptionResponseDto {
    return {
        id: entity.getId()!,
        providerId: entity.getProviderId(),
        date: entity.getDate(),
        type: entity.getType(),
        customSlots: entity.getCustomSlots(),
        reason: entity.getReason(),
        createdAt: entity.getCreatedAt()!,
        updatedAt: entity.getUpdatedAt()!,
    };
  }


}