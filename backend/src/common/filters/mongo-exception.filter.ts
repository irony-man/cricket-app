import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 409;

    if (exception.code === 11000) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const duplicateKey = Object.keys(exception.keyValue)[0];
      const message = `Duplicate field: ${duplicateKey} already exists.`;

      response.status(status).json({
        statusCode: status,
        message: new ConflictException(message).message,
      });
    } else {
      // For other MongoErrors, send a generic error
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }
}
