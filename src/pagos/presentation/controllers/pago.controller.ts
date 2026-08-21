import { Controller, Get, Param, UseGuards, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { IPagoService } from '../../domain/interfaces/pago-service.interface.js';
import { PAGO_SERVICE } from '../../infrastructure/constants/injection-tokens.js';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator.js';
import { PagoResponseDto } from '../dtos/pago-response.dto.js';

@ApiTags('pagos')
@ApiBearerAuth()
@Controller('pagos')
@UseGuards(JwtAuthGuard)
export class PagoController {
  constructor(
    @Inject(PAGO_SERVICE)
    private readonly pagoService: IPagoService,
  ) {}

  @ApiOperation({ summary: 'Lista los pagos realizados por el cliente autenticado' })
  @Get('mis-pagos')
  async getMisPagos(@CurrentUser() user: { id: string; role: string }) {
    const pagos = await this.pagoService.findByCliente(user.id);
    return pagos.map((p) => PagoResponseDto.fromEntity(p));
  }

  @ApiOperation({ summary: 'Lista los pagos recibidos por el proveedor autenticado' })
  @Get('proveedor/recibidos')
  async getPagosRecibidos(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== 'proveedor') {
      throw new ForbiddenException('Solo los proveedores pueden acceder a esta ruta');
    }
    const pagos = await this.pagoService.findByProveedor(user.id);
    return pagos.map((p) => PagoResponseDto.fromEntity(p));
  }

  @ApiOperation({ summary: 'Busca un pago por su referencia externa de Mercado Pago' })
  @Get('referencia/:ref')
  async getByReferencia(@Param('ref') ref: string, @CurrentUser() user: { id: string; role: string }) {
    const pago = await this.pagoService.findByExternalReference(ref);
    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }
    if (pago.getClienteId() !== user.id && pago.getProveedorId() !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver este pago');
    }
    return PagoResponseDto.fromEntity(pago);
  }

  @ApiOperation({ summary: 'Obtiene un pago por id' })
  @Get(':id')
  async getById(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    const pago = await this.pagoService.findById(id);
    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }
    if (pago.getClienteId() !== user.id && pago.getProveedorId() !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver este pago');
    }
    return PagoResponseDto.fromEntity(pago);
  }
}
