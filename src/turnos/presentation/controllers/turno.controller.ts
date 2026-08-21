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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

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

@ApiTags('turnos')
@ApiBearerAuth()
@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnoController {

  constructor(
    @Inject(TURNO_SERVICE)
    private readonly turnoService: ITurnoService,
  ) {}

  @ApiOperation({ summary: 'Crea un turno para un cliente autenticado' })
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

  @ApiOperation({ summary: 'Crea un turno como invitado, sin necesidad de registrarse (público)' })
  @Post('guest')
  @Public()
  async createGuest(
    @Body() dto: CreateTurnoGuestRequestDto,
  ): Promise<TurnoResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.turnoService.createTurnoGuest(serviceDto);
    return TurnoResponseDto.fromEntity(entity);
  }

  @ApiOperation({ summary: 'Lista todos los turnos (solo admin)' })
  @Get()
  @Roles('admin')
  async findAll(): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findAll();
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @ApiOperation({ summary: 'Lista los turnos de un proveedor' })
  @Get('proveedor/:proveedorId')
  @Roles('provider', 'admin')
  async findByProveedor(
    @Param('proveedorId', ParseMongoIdPipe) proveedorId: string,
  ): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findByProveedor(proveedorId);
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @ApiOperation({ summary: 'Lista los turnos de un cliente' })
  @Get('cliente/:clienteId')
  @Roles('client', 'admin')
  async findByCliente(
    @Param('clienteId', ParseMongoIdPipe) clienteId: string,
  ): Promise<TurnoResponseDto[]> {
    const entities = await this.turnoService.findByCliente(clienteId);
    return entities.map(TurnoResponseDto.fromEntity);
  }

  @ApiOperation({ summary: 'Obtiene la agenda de turnos de un proveedor para un día puntual' })
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

  @ApiOperation({ summary: 'Lista turnos que requieren recordatorio (uso interno de n8n, requiere secreto compartido)' })
  @Get('recordatorios')
  @Public()
  @UseGuards(N8nSecretGuard)
  async getRecordatorios(
    @Query('ventana') ventana: '12h' | '3h',
  ) {
    return this.turnoService.getRecordatorios(ventana);
  }

  @ApiOperation({ summary: 'Cancela todos los turnos de un proveedor para un día (masivo)' })
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

  @ApiOperation({ summary: 'Obtiene un turno por id' })
  @Get(':id')
  @Roles('client', 'provider', 'admin')
  async findById(
    @Param('id', ParseMongoIdPipe) id: string,
  ): Promise<TurnoResponseDto> {
    const entity = await this.turnoService.findById(id);
    return TurnoResponseDto.fromEntity(entity);
  }

  @ApiOperation({ summary: 'Actualiza un turno (fecha, hora, estado, etc.)' })
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

  @ApiOperation({ summary: 'Marca un recordatorio como enviado (uso interno de n8n, requiere secreto compartido)' })
  @Patch(':id/recordatorio-enviado')
  @Public()
  @UseGuards(N8nSecretGuard)
  async marcarRecordatorioEnviado(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: MarcarRecordatorioRequestDto,
  ): Promise<void> {
    return this.turnoService.marcarRecordatorioEnviado(id, dto.tipo);
  }

  @ApiOperation({ summary: 'Elimina un turno' })
  @Delete(':id')
  @Roles('provider', 'admin')
  async delete(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<void> {
    return this.turnoService.delete(id, user.id, user.role);
  }
}
