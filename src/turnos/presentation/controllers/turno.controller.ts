import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  UseGuards,
} from '@nestjs/common';

import type { ITurnoService } from '../../domain/interfaces/turno-service.interface.js';
import { TURNO_SERVICE } from '../../infrastructure/constants/injection-tokens.js';
import { ParseMongoIdPipe } from '../../../common/pipes/parse-mongo-id.pipe.js';

import { CreateTurnoRequestDto } from '../dtos/turno-dto-request/create-turno-request.dto.js';
import { CreateTurnoGuestRequestDto } from '../dtos/turno-dto-request/create-turno-guest.dto.js';
import { UpdateTurnoRequestDto } from '../dtos/turno-dto-request/update-turno-request.dto.js';
import { MarcarRecordatorioRequestDto } from '../dtos/turno-dto-request/marcar-recordatorio.dto.js';
import { CancelarDiaRequestDto } from '../dtos/turno-dto-request/cancelar-dia.dto.js';
import { TurnoResponseDto } from '../dtos/turno-dto-response/turno-response.dto.js';

import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard.js';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator.js';
import { Public } from '../../../auth/presentation/decorators/public.decorator.js';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator.js';
import { N8nSecretGuard } from '../../../common/guards/n8n-secret.guard.js';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnoController {

  constructor(
    @Inject(TURNO_SERVICE)
    private readonly turnoService: ITurnoService,
  ) {}

  @Post()
  @Roles('client', 'provider', 'admin')
  async create(
    @Body() dto: CreateTurnoRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<TurnoResponseDto> {
    const serviceDto = dto.toServiceDto();
    const userId = user.id;
    const entity = await this.turnoService.create(serviceDto, userId);
    return TurnoResponseDto.fromEntity(entity);
  }

  @Post('guest')
  @Public()
  async createGuest(
    @Body() dto: CreateTurnoGuestRequestDto,
  ): Promise<TurnoResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.turnoService.createTurnoGuest(serviceDto);
    return TurnoResponseDto.fromEntity(entity);
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findAll();
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @Get('proveedor/:proveedorId')
  @Roles('provider', 'admin')
  async findByProveedor(
    @Param('proveedorId', ParseMongoIdPipe) proveedorId: string,
  ): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findByProveedor(proveedorId);
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @Get('cliente/:clienteId')
  @Roles('client', 'admin')
  async findByCliente(
    @Param('clienteId', ParseMongoIdPipe) clienteId: string,
  ): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findByCliente(clienteId);
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @Get('proveedor/:proveedorId/agenda')
  @Roles('provider', 'admin')
  async getAgendaDia(
    @Param('proveedorId', ParseMongoIdPipe) proveedorId: string,
    @Query('fecha') fecha: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    const fechaLocal = new Date(fecha + 'T00:00:00');
    return this.turnoService.getAgendaDia(proveedorId, fechaLocal, user.id, user.role);
  }

  @Get('recordatorios')
  @Public()
  @UseGuards(N8nSecretGuard)
  async getRecordatorios(
    @Query('ventana') ventana: '12h' | '3h',
  ) {
    return this.turnoService.getRecordatorios(ventana);
  }

  @Patch('proveedor/:proveedorId/cancelar-dia')
  @Roles('provider', 'admin')
  async cancelarDia(
    @Param('proveedorId', ParseMongoIdPipe) proveedorId: string,
    @Body() dto: CancelarDiaRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.turnoService.cancelarTurnosDelDia(
      proveedorId,
      dto.parseLocalDate(),
      user.id,
      user.role,
    );
  }

  @Get(':id')
  @Roles('client', 'provider', 'admin')
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<TurnoResponseDto> {
    const entity = await this.turnoService.findById(id);
    return TurnoResponseDto.fromEntity(entity);
  }

  @Patch(':id')
  @Roles('provider', 'admin')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateTurnoRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<TurnoResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.turnoService.update(
      id,
      serviceDto.toUpdateData(),
      user.id,
      user.role,
    );
    return TurnoResponseDto.fromEntity(entity);
  }

  @Patch(':id/recordatorio-enviado')
  @Public()
  @UseGuards(N8nSecretGuard)
  async marcarRecordatorioEnviado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: MarcarRecordatorioRequestDto,
  ): Promise<void> {
    return this.turnoService.marcarRecordatorioEnviado(id, dto.tipo);
  }

  @Delete(':id')
  @Roles('provider', 'admin')
  async delete(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<void> {
    return this.turnoService.delete(id, user.id, user.role);
  }
}
