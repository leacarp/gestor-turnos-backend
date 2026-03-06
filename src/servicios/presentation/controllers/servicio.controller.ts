import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';

import type { IServicioService } from '../../domain/interfaces/servicio-service.interface.js';
import { SERVICIO_SERVICE } from '../../infrastructure/constants/injection-tokens.js';

import { CreateServicioRequestDto } from '../dtos/servicio-dto-request/create-servicio-request.dto.js';
import { UpdateServicioRequestDto } from '../dtos/servicio-dto-request/update-servicio-request.dto.js';
import { ServicioResponseDto } from '../dtos/servicio-dto-response/servicio-response.dto.js';

import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard.js';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator.js';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator.js';

@Controller('servicios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('provider', 'admin')
export class ServicioController {

  constructor(
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateServicioRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<ServicioResponseDto> {
    return this.servicioService.create(dto, user.id);
  }

  @Get()
  async findAll(): Promise<ServicioResponseDto[]> {
    return this.servicioService.findAll();
  }

  @Get('proveedor/:proveedorId')
  async findByProveedor(
    @Param('proveedorId') proveedorId: string,
  ): Promise<ServicioResponseDto[]> {
    return this.servicioService.findByProveedor(proveedorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ServicioResponseDto> {
    return this.servicioService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServicioRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<ServicioResponseDto> {
    return this.servicioService.update(id, dto, user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<void> {
    return this.servicioService.delete(id, user.id);
  }
}
