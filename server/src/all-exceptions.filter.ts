import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { LoggerService } from './logger/logger.service.js';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObj = {
  StatusCode: number;
  timeStamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const MyResponseObj: MyResponseObj = {
      StatusCode: 200,
      timeStamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      MyResponseObj.StatusCode = exception.getStatus();
      MyResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      MyResponseObj.StatusCode = HttpStatus.BAD_REQUEST;
      MyResponseObj.response = exception.message.replaceAll(/\n/g, '');
    } else {
      MyResponseObj.StatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      MyResponseObj.response = 'Internal Server Error';
    }

    response.status(MyResponseObj.StatusCode).json(MyResponseObj);

    this.logger.error(MyResponseObj.response, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}
