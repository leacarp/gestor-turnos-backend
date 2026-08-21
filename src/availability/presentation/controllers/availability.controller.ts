import { Controller, Get, Post, Delete, Body, Param, Query, Inject, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { IAvailabilityService } from '../../services/interfaces/IAvailabilityService';
import { WeeklyScheduleEntity } from '../../domain/entities/weeklySchedule.entity';
import { AvailabilityExceptionEntity } from '../../domain/entities/availabilityException.entity';
import { WeeklyScheduleRequestDto } from '../dto/availability-request/weeklySchedule-request.dto';
import { AvailabilityExceptionRequestDto } from '../dto/availability-request/availabilityException-request.dto';
import { GetSlotsRequestDto } from '../dto/availability-request/getSlots-request.dto';
import { GetExceptionByDateRequestDto } from '../dto/availability-request/getExceptionByDate-request.dto';
import { WeeklyScheduleResponseDto } from '../dto/availability-response/weeklySchedule-response.dto';
import { AvailabilityExceptionResponseDto } from '../dto/availability-response/availabilityException-response.dto';
import { AvailableSlotResponseDto } from '../dto/availability-response/availableSlots-response.dto';
import { WeeklyScheduleDtoService } from '../../services/dto/availability-dto.request/weeklySchedule-service.dto';
import { AvailabilityExceptionDtoService } from '../../services/dto/availability-dto.request/availabilityException-service.dto';
import { GetSlotsDtoService } from '../../services/dto/availability-dto.request/getSlots-service.dto';
import { CurrentUser } from 'src/auth/presentation/decorators/current-user.decorator';
import { AuthUserDto } from 'src/auth/presentation/dtos/auth-dto-response/auth-user.dto';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/presentation/decorators/roles.decorator';
import { AVAILABILITY_SERVICE } from 'src/availability/infrastructure/constants/injection-tokens';
import { Public } from '../../../auth/presentation/decorators/public.decorator.js';


@ApiTags('availability')
@ApiBearerAuth()
@Controller('availability')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvailabilityController {
  constructor(
    @Inject(AVAILABILITY_SERVICE) private readonly availabilityService: IAvailabilityService,
  ) {}

  // --- Weekly Schedule ---

  @ApiOperation({ summary: 'Crea el horario semanal del proveedor' })
  @Post('schedule')
  @Roles('provider')
  async createSchedule(@CurrentUser() user : AuthUserDto, @Body() dto: WeeklyScheduleRequestDto): Promise<WeeklyScheduleResponseDto> {
    const serviceDto = new WeeklyScheduleDtoService(user.id, dto.slots, dto.appointmentGap ?? 0);
    const entity = await this.availabilityService.createSchedule(serviceDto);
    return this.toWeeklyScheduleResponse(entity);
  }

  @ApiOperation({ summary: 'Obtiene el horario semanal del proveedor autenticado' })
  @Get('schedule')
  @Roles('provider')
  async getSchedule(@CurrentUser() user : AuthUserDto): Promise<WeeklyScheduleResponseDto> {
    const entity = await this.availabilityService.getSchedule(user.id);
    return this.toWeeklyScheduleResponse(entity);
  }

  @ApiOperation({ summary: 'Actualiza el horario semanal del proveedor' })
  @Put('schedule')
  @Roles('provider')
  async updateSchedule(@CurrentUser() user : AuthUserDto, @Body() dto: WeeklyScheduleRequestDto): Promise<WeeklyScheduleResponseDto> {
    const serviceDto = new WeeklyScheduleDtoService(user.id, dto.slots, dto.appointmentGap ?? 0);
    const entity = await this.availabilityService.updateSchedule(user.id, serviceDto);
    return this.toWeeklyScheduleResponse(entity);
  }
    
    // --- Exceptions ---
    
  @ApiOperation({ summary: 'Crea una excepción de disponibilidad (día libre u horario especial)' })
  @Post('exceptions')
  @Roles('provider')
  async createException(@CurrentUser() user : AuthUserDto, @Body() dto: AvailabilityExceptionRequestDto): Promise<AvailabilityExceptionResponseDto> {
    const serviceDto = new AvailabilityExceptionDtoService(
        user.id,
        new Date(dto.date + 'T00:00:00'),
        dto.type,
        dto.customSlots,
        dto.reason,
    );
    const entity = await this.availabilityService.createException(serviceDto);
    return this.toExceptionResponse(entity);
  }
    
  @ApiOperation({ summary: 'Lista las excepciones de disponibilidad de un mes' })
  @Get('exceptions')
  @Roles('provider')
  async getExceptionsByMonth(@CurrentUser() user : AuthUserDto, @Query('year') year: string, @Query('month') month: string): Promise<AvailabilityExceptionResponseDto[]> {
    const entities = await this.availabilityService.getExceptionsByMonth(
        user.id,
        parseInt(year),
        parseInt(month),
    );
    return entities.map(entity => this.toExceptionResponse(entity));
  }
  
  @ApiOperation({ summary: 'Busca la excepción de disponibilidad de una fecha puntual' })
  @Get('exceptions/date')
  @Roles('provider')
  async findExceptionByDate(@CurrentUser() user : AuthUserDto, @Query() query: GetExceptionByDateRequestDto): Promise<AvailabilityExceptionResponseDto | null> {
    const entity = await this.availabilityService.getExceptionsByDate(
      user.id,
      new Date(query.date + 'T00:00:00'),
    );
    return entity ? this.toExceptionResponse(entity) : null;
  }



  @ApiOperation({ summary: 'Elimina una excepción de disponibilidad' })
  @Delete('exceptions/:exceptionId')
  @Roles('provider')
  async deleteException(@Param('exceptionId') exceptionId: string): Promise<{ message: string }> {
    await this.availabilityService.deleteException(exceptionId);
    return { message: 'Exception deleted successfully' };
  }
    
    // --- Available Slots ---
  @ApiOperation({ summary: 'Obtiene los horarios disponibles de un proveedor para una fecha (endpoint público)' })
  @Public()
  @Get('slots/:providerId')
  @Roles('client', 'provider', 'admin')
  async getAvailableSlots(@Param('providerId') providerId: string, @Query() query: GetSlotsRequestDto): Promise<AvailableSlotResponseDto[]> {
    const date = new Date(query.date + 'T00:00:00');
    const serviceDto = new GetSlotsDtoService(providerId, date, query.servicioId);
    return this.availabilityService.getAvailableSlots(serviceDto);
  }
    
    
  private toWeeklyScheduleResponse(entity: WeeklyScheduleEntity): WeeklyScheduleResponseDto {
    return {
        id: entity.getId()!,
        providerId: entity.getProviderId(),
        slots: entity.getSlots(),
        appointmentGap: entity.getAppointmentGap(),
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