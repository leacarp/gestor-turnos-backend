export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongoDb: process.env.MONGODB,
  port: process.env.PORT || 3005,
  dbName: 'gestorTurnos',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
});
