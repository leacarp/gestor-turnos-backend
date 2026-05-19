import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

async function bootstrap() {
  try{

    const app = await NestFactory.create(AppModule);

    const corsOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];

    app.enableCors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new MongoExceptionFilter());
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  } catch(error){
    Logger.error('❌ Error durante el bootstrap:', error, 'Bootstrap');
    process.exit(1);
  }

}
bootstrap();
