export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDb: process.env.MONGODB,
  port: process.env.PORT || 3005,
  dbName: 'gestorTurnos',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',

  mercadoPago: {
    appId: process.env.MP_APP_ID,
    clientSecret: process.env.MP_CLIENT_SECRET,
    publicKey: process.env.MP_PUBLIC_KEY,
    accessToken: process.env.MP_ACCESS_TOKEN,
    redirectUri: process.env.MP_REDIRECT_URI || 'http://localhost:3005/api/mercadopago/oauth/callback',
    webhookUrl: process.env.MP_WEBHOOK_URL,
    webhookSecret: process.env.MP_WEBHOOK_SECRET,
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    successUrl: process.env.FRONTEND_SUCCESS_URL || 'http://localhost:3000/pagos/exito',
    failureUrl: process.env.FRONTEND_FAILURE_URL || 'http://localhost:3000/pagos/error',
    pendingUrl: process.env.FRONTEND_PENDING_URL || 'http://localhost:3000/pagos/pendiente',
  },

  n8n: {
    sharedSecret: process.env.N8N_SHARED_SECRET,
    webhookTurnoCreado: process.env.N8N_WEBHOOK_TURNO_CREADO,
    webhookCancelacionDia: process.env.N8N_WEBHOOK_CANCELACION_DIA,
  },
});
