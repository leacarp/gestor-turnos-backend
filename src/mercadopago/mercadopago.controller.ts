import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoService } from './mercadopago.service.js';
import { CreatePreferenceRequestDto } from './dtos/create-preference-request.dto.js';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/presentation/decorators/current-user.decorator.js';
import { WebhookSignatureGuard } from './guards/webhook-signature.guard.js';
import { CreateGuestPreferenceRequestDto } from './dtos/create-guest-preference-request.dto.js';

@Controller('mercadopago')
export class MercadoPagoController {
  private readonly logger = new Logger(MercadoPagoController.name);

  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Crea una preferencia de pago de seña para un turno como invitado.
   * NO requiere autenticación. Devuelve la URL de pago de Mercado Pago.
   */
  @Post('guest-preference')
  async createGuestPreference(@Body() dto: CreateGuestPreferenceRequestDto) {
    const result = await this.mercadoPagoService.createGuestPreference(
      dto.proveedorId,
      dto.servicioId,
      dto.guestDetails,
      dto.fecha,
      dto.horaInicio,
      dto.notas,
    );

    return {
      initPoint: result.initPoint,
      preferenceId: result.preferenceId,
      externalReference: result.externalReference,
      montoSeña: result.montoSeña,
    };
  }

  /**
   * Crea una preferencia de pago de seña para un turno.
   * El cliente debe estar autenticado. Devuelve la URL de pago de Mercado Pago.
   */
  @Post('preference')
  @UseGuards(JwtAuthGuard)
  async createPreference(
    @Body() dto: CreatePreferenceRequestDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    const result = await this.mercadoPagoService.createPreference(
      dto.proveedorId,
      dto.servicioId,
      user.id,
      dto.fecha,
      dto.horaInicio,
      dto.notas,
    );

    return {
      initPoint: result.initPoint,
      preferenceId: result.preferenceId,
      externalReference: result.externalReference,
      montoSeña: result.montoSeña,
    };
  }

  /**
   * Webhook que recibe notificaciones de Mercado Pago.
   * Cuando el pago es aprobado, crea el Pago y el Turno.
   * Este endpoint NO requiere autenticación (lo llama MP directamente).
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: Request, @Res() res: Response) {
    // Soportar formato Webhook (type, data.id) o IPN (topic, id / resource)
    const type = req.body?.type || req.query?.type || req.body?.topic || req.query?.topic;
    const paymentId = req.body?.data?.id || req.body?.id || req.query?.['data.id'] || req.query?.id;

    if ((type === 'payment' || type === 'payment.created') && paymentId) {
      this.mercadoPagoService
        .processWebhook(String(paymentId))
        .catch((err) => this.logger.error(`Error procesando webhook pago ${paymentId}: ${err}`));
    }

    res.sendStatus(200);
  }

  /**
   * Inicia el flujo OAuth para conectar la cuenta de Mercado Pago del proveedor.
   * El proveedor debe estar autenticado.
   */
  @Get('oauth/connect')
  @UseGuards(JwtAuthGuard)
  connectOAuth(@CurrentUser() user: { id: string; role: string }) {
    const url = this.mercadoPagoService.getOAuthUrl(user.id);
    return { url };
  }

  /**
   * Callback OAuth de Mercado Pago.
   * MP redirige aquí con el código de autorización tras que el proveedor autoriza.
   */
  @Get('oauth/callback')
  async oauthCallback(
    @Query('code') code: string,
    @Query('state') proveedorId: string,
    @Res() res: Response,
  ) {
    const frontendUrl = this.configService.get<string>('frontend.url');

    try {
      await this.mercadoPagoService.handleOAuthCallback(code, proveedorId);
      res.redirect(`${frontendUrl}/configuracion/mp-conectado`);
    } catch (err) {
      this.logger.error(`Error en OAuth callback: ${err}`);
      res.redirect(`${frontendUrl}/configuracion/mp-error`);
    }
  }
}
