import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const httpStatus = this.getHttpStatus(exception);

      if (!response.headersSent) {
        response.status(httpStatus).json({
          statusCode: httpStatus,
          message: this.getMessage(exception),
          timestamp: new Date().toISOString(),
          path: request.url,
          type: this.getErrorType(exception),
          stack: this.getStack(exception),
          details: this.getExceptionDetails(exception),
        });

        super.catch(exception, host);
      }
    } catch (error) {}
  }

  getErrorType(exception: unknown): string {
    if (exception instanceof TypeORMError) {
      return 'database-error';
    }

    if (exception instanceof HttpException) {
      return 'http-error';
    }

    return 'default-error';
  }

  getMessage(exception: unknown): string {
    return exception['hint'] || exception['message'] || 'error';
  }

  getStack(exception: unknown): string {
    return exception['stack'] || 'error';
  }

  getHttpStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getExceptionDetails(exception: unknown): any {
    return exception;
  }
}
