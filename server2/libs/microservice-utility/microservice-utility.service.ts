import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceUtilityService {
  returnSuccess(data: any) {
    return {
      statusCode: 200,
      message: 'Success',
      data: data,
    };
  }

  successStandardReturn(message: string) {
    return {
      statusCode: 200,
      message: message,
    };
  }

  notFoundExceptionReturn(message: string) {
    return {
      statusCode: 404,
      message: message,
      data: null,
    };
  }

  internalServerErrorReturn(message: string) {
    return {
      statusCode: 500,
      message: message,
      data: null,
    };
  }

  badRequestExceptionReturn(message: string) {
    return {
      statusCode: 400,
      message: message,
      data: null,
    };
  }

  async unauthorizedExceptionReturn(message: string) {
    return {
      statusCode: 401,
      message: message,
      data: null,
    };
  }

  async forbiddenExceptionReturn(message: string) {
    return {
      statusCode: 403,
      message: message,
      data: null,
    };
  }

  async conflictExceptionReturn(message: string) {
    return {
      statusCode: 409,
      message: message,
      data: null,
    };
  }

  async unprocessableEntityExceptionReturn(message: string) {
    return {
      statusCode: 422,
      message: message,
      data: null,
    };
  }
}
