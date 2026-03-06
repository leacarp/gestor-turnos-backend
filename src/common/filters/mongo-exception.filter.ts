import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code === 11000) {
      const field = this.extractDuplicateField(exception);

      this.logger.warn(`Campo duplicado: ${field}`);

      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: `El valor del campo '${field}' ya está registrado`,
        error: 'Conflict',
      });
      return;
    }

    this.logger.error(`Error de MongoDB no controlado: ${exception.message}`);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  }

  private extractDuplicateField(exception: MongoError): string {
    const errorMessage = exception.message || '';
    const match = errorMessage.match(/index:\s+(\w+)_/);

    if (match) {
      return match[1];
    }

    const keyValue = (exception as any).keyValue;
    if (keyValue) {
      return Object.keys(keyValue)[0];
    }

    return 'desconocido';
  }
}
