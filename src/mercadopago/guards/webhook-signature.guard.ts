import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  private readonly logger = new Logger(WebhookSignatureGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const xSignature = request.headers['x-signature'];
    const xRequestId = request.headers['x-request-id'];

    if (!xSignature || !xRequestId) {
      this.logger.warn('Faltan headers x-signature o x-request-id en el webhook de Mercado Pago');
      throw new UnauthorizedException('Firma no válida');
    }

    const secret = this.configService.get<string>('mercadoPago.webhookSecret');
    if (!secret) {
      this.logger.error('MP_WEBHOOK_SECRET no está configurado');
      throw new UnauthorizedException('Firma no válida');
    }

    try {
      // 1. Extraer ts y v1 de x-signature (ej: ts=1234,v1=abcd...)
      const parts = (xSignature as string).split(',');
      let ts = '';
      let v1 = '';
      
      for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') v1 = value;
      }

      if (!ts || !v1) {
        throw new Error('Formato de x-signature inválido');
      }

      // 2. Extraer data.id del body o query
      let dataId = request.body?.data?.id;
      
      if (!dataId) {
        this.logger.warn(`Body recibido: ${JSON.stringify(request.body)}, Query: ${JSON.stringify(request.query)}`);
        
        // A veces MP envía el ID directamente en el body.id o en el query dependiendo de la configuración
        dataId = request.body?.id || request.query?.['data.id'] || request.query?.id;
      }

      if (!dataId) {
        throw new Error('Falta data.id en el body o query');
      }

      // 3. Construir el manifest
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

      // 4. Calcular HMAC SHA256
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(manifest);
      const calculatedSignature = hmac.digest('hex');

      // 5. Comparar usando timingSafeEqual para evitar ataques de tiempo
      const isValid = crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, 'hex'),
        Buffer.from(v1, 'hex')
      );

      if (!isValid) {
        this.logger.warn(`Firma inválida. RequestID: ${xRequestId}`);
        this.logger.debug(`Manifest usado: ${manifest}`);
        this.logger.debug(`Firma recibida (v1): ${v1}`);
        this.logger.debug(`Firma calculada: ${calculatedSignature}`);
        throw new UnauthorizedException('Firma no válida');
      }

      return true;
    } catch (error) {
      this.logger.warn(`Error al validar webhook: ${error instanceof Error ? error.message : error}`);
      throw new UnauthorizedException('Firma no válida');
    }
  }
}
