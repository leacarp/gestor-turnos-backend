export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDb: process.env.MONGODB,
  port: process.env.PORT || 3000,
  dbName: 'gestorTurnos',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',

  mercadoPago: {
    appId: process.env.MP_APP_ID,
    clientSecret: process.env.MP_CLIENT_SECRET,
    publicKey: process.env.MP_PUBLIC_KEY,
    accessToken: process.env.MP_ACCESS_TOKEN,
    redirectUri:
      process.env.MP_REDIRECT_URI ||
      'https://gestor-turnos-backend.onrender.com/api/mercadopago/oauth/callback',
    webhookUrl:
      process.env.MP_WEBHOOK_URL ||
      'https://gestor-turnos-backend.onrender.com/api/mercadopago/webhook',
    webhookSecret: process.env.MP_WEBHOOK_SECRET,
  },

  frontend: {
    // Origen del frontend (Vite corre en 5173). De acá se derivan las back_urls
    // de Mercado Pago (/pagos/exito, /pagos/error, /pagos/pendiente) y los
    // redirects del callback de OAuth.
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  n8n: {
    sharedSecret: process.env.N8N_SHARED_SECRET,
    webhookTurnoCreado:
      process.env.N8N_WEBHOOK_TURNO_CREADO ||
      'https://primary-production-e79b2.up.railway.app/webhook/turno-creado',
    webhookCancelacionDia:
      process.env.N8N_WEBHOOK_CANCELACION_DIA ||
      'https://primary-production-e79b2.up.railway.app/webhook/cancelacion-dia',
  },
});
