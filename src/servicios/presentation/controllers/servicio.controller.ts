import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Inject,
  UseGuards
} from '@nestjs/common';

import type { IServicioService } from '../../domain/interfaces/servicio-service.interface.js';
import { SERVICIO_SERVICE } from '../../infrastructure/constants/injection-tokens.js';
import { ParseMongoIdPipe } from '../../../common/pipes/parse-mongo-id.pipe.js';

import { CreateServicioRequestDto } from '../dtos/servicio-dto-request/create-servicio-request.dto.js';
import { UpdateServicioRequestDto } from '../dtos/servicio-dto-request/update-servicio-request.dto.js';
import { ServicioResponseDto } from '../dtos/servicio-dto-response/servicio-response.dto.js';

import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard.js';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator.js';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator.js';
import { Public } from '../../../auth/presentation/decorators/public.decorator.js';

@Controller('servicios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('provider', 'admin')
export class ServicioController {

  constructor(
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
  ) { }

  @Post()
  async create(
    @Body() dto: CreateServicioRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<ServicioResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.servicioService.create(
      serviceDto.getNombre(),
      serviceDto.getDuracion(),
      serviceDto.getPrecio(),
      user.id,
      serviceDto.getCategoria(),
      serviceDto.getDescription(),
      serviceDto.getRequiereSeña(),
      serviceDto.getPorcentajeSeña(),
    );
    return ServicioResponseDto.fromEntity(entity);
  }

  @Get()
  async findAll(): Promise<ServicioResponseDto[]> {
    const entities = await this.servicioService.findAll();
    return entities.map(ServicioResponseDto.fromEntity);
  }

  @Public()
  @Get('proveedor/:proveedorId')
  async findByProveedor(
    @Param('proveedorId', ParseMongoIdPipe) proveedorId: string,
  ): Promise<ServicioResponseDto[]> {
    const entities = await this.servicioService.findByProveedor(proveedorId);
    return entities.map(ServicioResponseDto.fromEntity);
  }

  @Get(':id')
  async findById(@Param('id', ParseMongoIdPipe) id: string): Promise<ServicioResponseDto> {
    const entity = await this.servicioService.findById(id);
    return ServicioResponseDto.fromEntity(entity);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateServicioRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<ServicioResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.servicioService.update(
      id,
      serviceDto.toUpdateData(),
      user.id,
    );
    return ServicioResponseDto.fromEntity(entity);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseMongoIdPipe) id: string,
    @CurrentUser() user: { id: string; role: string },
  ): Promise<void> {
    return this.servicioService.delete(id, user.id);
  }
}
