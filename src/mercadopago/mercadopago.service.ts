import { Injectable, Inject, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment, OAuth } from 'mercadopago';
import { randomUUID } from 'crypto';
import type { IServicioService } from '../servicios/domain/interfaces/servicio-service.interface.js';
import type { IPagoService } from '../pagos/domain/interfaces/pago-service.interface.js';
import type { ITurnoService } from '../turnos/domain/interfaces/turno-service.interface.js';
import type { IUserService } from '../user/services/interfaces/IUserService.js';
import { SERVICIO_SERVICE } from '../servicios/infrastructure/constants/injection-tokens.js';
import { PAGO_SERVICE } from '../pagos/infrastructure/constants/injection-tokens.js';
import { TURNO_SERVICE } from '../turnos/infrastructure/constants/injection-tokens.js';
import { USER_SERVICE } from '../user/infrastructure/constants/user-service.constants.js';

export interface TurnoMetadata {
  proveedor_id: string;
  cliente_id?: string;
  servicio_id: string;
  fecha: string;
  hora_inicio: string;
  notas?: string;
  monto_total: number;
  porcentaje_sena: number;
  is_guest?: boolean;
  guest_nombre?: string;
  guest_email?: string;
  guest_celular?: string;
}

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(SERVICIO_SERVICE)
    private readonly servicioService: IServicioService,
    @Inject(PAGO_SERVICE)
    private readonly pagoService: IPagoService,
    @Inject(TURNO_SERVICE)
    private readonly turnoService: ITurnoService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) { }

  async createPreference(
    proveedorId: string,
    servicioId: string,
    clienteId: string,
    fecha: string,
    horaInicio: string,
    notas?: string,
  ): Promise<{ initPoint: string; preferenceId: string; externalReference: string; montoSeña: number }> {
    const servicio = await this.servicioService.findById(servicioId);

    if (!servicio.getRequiereSeña()) {
      throw new BadRequestException('Este servicio no requiere seña. Creá el turno directamente en /turnos');
    }

    if (servicio.getProveedorId() !== proveedorId) {
      throw new BadRequestException('El servicio no pertenece al proveedor indicado');
    }

    const montoSeña = servicio.calcularMontoSeña();
    
    if (!montoSeña || montoSeña <= 0) {
      throw new BadRequestException('El monto de la seña debe ser mayor a 0 para generar la preferencia de pago');
    }

    const externalReference = randomUUID();

    const accessToken = await this.resolveAccessToken(proveedorId);
    const client = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(client);

    const metadata: TurnoMetadata = {
      proveedor_id: proveedorId,
      cliente_id: clienteId,
      servicio_id: servicioId,
      fecha,
      hora_inicio: horaInicio,
      notas,
      monto_total: servicio.getPrecio(),
      porcentaje_sena: 0,
    };

    const backUrls = this.getFrontendBackUrls();

    const frontendUrl = this.configService.get<string>('frontend.url') ?? 'http://localhost:3000';
    const isPublicUrl = !frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1');

    const body = {
      items: [
        {
          id: servicioId,
          title: `Seña - ${servicio.getNombre()}`,
          quantity: 1,
          unit_price: montoSeña,
          currency_id: 'ARS',
          description: `Seña fija de $${montoSeña} para reservar el turno`,
        },
      ],
      back_urls: backUrls,
      ...(isPublicUrl ? { auto_return: 'approved' as const } : {}),
      external_reference: externalReference,
      notification_url: `${this.configService.get<string>('mercadoPago.webhookUrl')}?source_news=webhooks`,
      metadata,
    };

    const response = await preferenceClient.create({ body });

    return {
      initPoint: response.init_point!,
      preferenceId: response.id!,
      externalReference,
      montoSeña,
    };
  }

  async createGuestPreference(
    proveedorId: string,
    servicioId: string,
    guestDetails: { nombre: string; email: string; celular?: string },
    fecha: string,
    horaInicio: string,
    notas?: string,
  ): Promise<{ initPoint: string; preferenceId: string; externalReference: string; montoSeña: number }> {
    const servicio = await this.servicioService.findById(servicioId);

    if (!servicio.getRequiereSeña()) {
      throw new BadRequestException('Este servicio no requiere seña. Creá el turno directamente en /turnos');
    }

    if (servicio.getProveedorId() !== proveedorId) {
      throw new BadRequestException('El servicio no pertenece al proveedor indicado');
    }

    const montoSeña = servicio.calcularMontoSeña();
    
    if (!montoSeña || montoSeña <= 0) {
      throw new BadRequestException('El monto de la seña debe ser mayor a 0 para generar la preferencia de pago');
    }

    const externalReference = randomUUID();
    const accessToken = await this.resolveAccessToken(proveedorId);
    const client = new MercadoPagoConfig({ accessToken });
    const preferenceClient = new Preference(client);

    const metadata: TurnoMetadata = {
      proveedor_id: proveedorId,
      servicio_id: servicioId,
      fecha,
      hora_inicio: horaInicio,
      notas,
      monto_total: servicio.getPrecio(),
      porcentaje_sena: 0,
      is_guest: true,
      guest_nombre: guestDetails.nombre,
      guest_email: guestDetails.email,
      guest_celular: guestDetails.celular,
    };

    const backUrls = this.getFrontendBackUrls();
    const frontendUrl = this.configService.get<string>('frontend.url') ?? 'http://localhost:3000';
    const isPublicUrl = !frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1');

    const body = {
      items: [
        {
          id: servicioId,
          title: `Seña - ${servicio.getNombre()}`,
          quantity: 1,
          unit_price: montoSeña,
          currency_id: 'ARS',
          description: `Seña fija de $${montoSeña} para reservar el turno (Invitado)`,
        },
      ],
      back_urls: backUrls,
      ...(isPublicUrl ? { auto_return: 'approved' as const } : {}),
      external_reference: externalReference,
      notification_url: `${this.configService.get<string>('mercadoPago.webhookUrl')}?source_news=webhooks`,
      metadata,
    };

    const response = await preferenceClient.create({ body });

    return {
      initPoint: response.init_point!,
      preferenceId: response.id!,
      externalReference,
      montoSeña,
    };
  }

  async processWebhook(paymentId: string): Promise<void> {
    const accessToken = this.configService.get<string>('mercadoPago.accessToken');

    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN no configurado');
    }

    const client = new MercadoPagoConfig({ accessToken });
    const paymentClient = new Payment(client);

    let payment: Awaited<ReturnType<typeof paymentClient.get>>;

    try {
      payment = await paymentClient.get({ id: paymentId });
    } catch (err) {
      this.logger.error(`Error al obtener pago ${paymentId} de MP: ${err}`);
      return;
    }

    if (payment.status !== 'approved') {
      this.logger.log(`Pago ${paymentId} con estado ${payment.status} - ignorado`);
      return;
    }

    const externalReference = payment.external_reference;

    if (!externalReference) {
      this.logger.warn(`Pago ${paymentId} sin external_reference`);
      return;
    }

    const pagoExistente = await this.pagoService.findByMpPaymentId(String(paymentId));

    if (pagoExistente) {
      this.logger.warn(`Pago ${paymentId} ya procesado`);
      return;
    }

    const metadata = payment.metadata as TurnoMetadata | undefined;

    if (!metadata || !metadata.proveedor_id) {
      this.logger.warn(`Pago ${paymentId} sin metadata de turno`);
      return;
    }

    if (!metadata.is_guest && !metadata.cliente_id) {
      this.logger.warn(`Pago ${paymentId} sin cliente_id (no es invitado)`);
      return;
    }

    const pago = await this.pagoService.create({
      proveedorId: metadata.proveedor_id,
      clienteId: metadata.cliente_id,
      servicioId: metadata.servicio_id,
      monto: payment.transaction_amount!,
      montoTotal: metadata.monto_total,
      porcentajeSeña: metadata.porcentaje_sena,
      estado: 'aprobado',
      mpPaymentId: String(payment.id),
      mpStatus: payment.status!,
      mpStatusDetail: payment.status_detail!,
      mpExternalReference: externalReference,
      guestEmail: metadata.guest_email,
    });

    if (metadata.is_guest && metadata.guest_nombre && metadata.guest_email) {
      await this.turnoService.createGuestFromPago({
        proveedorId: metadata.proveedor_id,
        servicioId: metadata.servicio_id,
        fecha: new Date(metadata.fecha),
        horaInicio: metadata.hora_inicio,
        notas: metadata.notas,
        pagoId: pago.getId()!,
        guestDetails: {
          nombre: metadata.guest_nombre,
          email: metadata.guest_email,
          celular: metadata.guest_celular,
        },
      });
    } else if (metadata.cliente_id) {
      await this.turnoService.createFromPago({
        proveedorId: metadata.proveedor_id,
        clienteId: metadata.cliente_id,
        servicioId: metadata.servicio_id,
        fecha: new Date(metadata.fecha),
        horaInicio: metadata.hora_inicio,
        notas: metadata.notas,
        pagoId: pago.getId()!,
      });
    }

    this.logger.log(`Turno creado desde pago MP ${paymentId} (ref: ${externalReference})`);
  }

  getOAuthUrl(proveedorId: string): string {
    const appId = this.configService.get<string>('mercadoPago.appId');
    const redirectUri = this.configService.get<string>('mercadoPago.redirectUri');

    return `https://auth.mercadopago.com/authorization?client_id=${appId}&response_type=code&platform_id=mp&state=${proveedorId}&redirect_uri=${encodeURIComponent(redirectUri!)}`;
  }

  async handleOAuthCallback(code: string, proveedorId: string): Promise<void> {
    const accessToken = this.configService.get<string>('mercadoPago.accessToken');
    const client = new MercadoPagoConfig({ accessToken: accessToken! });
    const oauthClient = new OAuth(client);

    const response = await oauthClient.create({
      body: {
        client_secret: this.configService.get<string>('mercadoPago.clientSecret')!,
        code,
        redirect_uri: this.configService.get<string>('mercadoPago.redirectUri')!,
      },
    });

    await this.userService.updateMpCredentials(proveedorId, {
      mpAccessToken: response.access_token!,
      mpRefreshToken: response.refresh_token ?? undefined,
      mpUserId: String(response.user_id),
      mpConnected: true,
      mpTokenExpiresAt: response.expires_in
        ? new Date(Date.now() + response.expires_in * 1000)
        : undefined,
    });

    this.logger.log(`Proveedor ${proveedorId} conectó su cuenta de Mercado Pago`);
  }

  private getFrontendBackUrls(): { success: string; failure: string; pending: string } {
    const defaults = {
      success: 'http://localhost:3000/pagos/exito',
      failure: 'http://localhost:3000/pagos/error',
      pending: 'http://localhost:3000/pagos/pendiente',
    };
    const fromConfig = this.configService.get<{
      successUrl?: string;
      failureUrl?: string;
      pendingUrl?: string;
    }>('frontend');
    return {
      success:
        fromConfig?.successUrl ??
        process.env.FRONTEND_SUCCESS_URL ??
        defaults.success,
      failure:
        fromConfig?.failureUrl ??
        process.env.FRONTEND_FAILURE_URL ??
        defaults.failure,
      pending:
        fromConfig?.pendingUrl ??
        process.env.FRONTEND_PENDING_URL ??
        defaults.pending,
    };
  }

  private async resolveAccessToken(proveedorId: string): Promise<string> {
    try {
      const provider = await this.userService.findOneUser(proveedorId);
      const providerData = provider.getProviderData();
      const mpToken = providerData?.getMpAccessToken();

      if (mpToken) {
        // Verificar si el token está por expirar (margen de 5 minutos)
        const expiresAt = providerData?.getMpTokenExpiresAt();
        const refreshToken = providerData?.getMpRefreshToken();

        if (expiresAt && refreshToken && expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
          return await this.refreshOAuthToken(proveedorId, refreshToken);
        }

        return mpToken;
      }
    } catch {
      // Si no se puede obtener el proveedor, usar el token de la app
    }

    const appToken = this.configService.get<string>('mercadoPago.accessToken');

    if (!appToken) {
      throw new BadRequestException('No hay token de Mercado Pago configurado');
    }

    return appToken;
  }

  private async refreshOAuthToken(proveedorId: string, refreshToken: string): Promise<string> {
    const appToken = this.configService.get<string>('mercadoPago.accessToken');
    if (!appToken) {
      throw new BadRequestException('No hay token de Mercado Pago configurado para refrescar');
    }

    const client = new MercadoPagoConfig({ accessToken: appToken });
    const oauthClient = new OAuth(client);

    try {
      const response = await oauthClient.refresh({
        body: {
          client_secret: this.configService.get<string>('mercadoPago.clientSecret')!,
          refresh_token: refreshToken,
        },
      });

      await this.userService.updateMpCredentials(proveedorId, {
        mpAccessToken: response.access_token!,
        mpRefreshToken: response.refresh_token ?? refreshToken,
        mpUserId: String(response.user_id),
        mpConnected: true,
        mpTokenExpiresAt: response.expires_in
          ? new Date(Date.now() + response.expires_in * 1000)
          : undefined,
      });

      this.logger.log(`Token de OAuth refrescado exitosamente para el proveedor ${proveedorId}`);
      return response.access_token!;
    } catch (error) {
      this.logger.error(`Error al refrescar el token OAuth para el proveedor ${proveedorId}: ${error}`);
      throw new BadRequestException('No se pudo refrescar el token de Mercado Pago');
    }
  }
}
