import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class ExceptionCheckerService {
  public async checker(
    result: MicroserviceUtility['returnValue'],
  ): Promise<void> {
    if (!result)
      throw new InternalServerErrorException(
        'Server failed, please try again.',
      );

    switch (result.statusCode) {
      case 200:
        return;
      case 404:
        throw new NotFoundException(result.message);
      case 500:
        throw new InternalServerErrorException(result.message);
      case 409:
        throw new ConflictException(result.message);
      case 400:
        throw new BadRequestException(result.message);
      case 401:
        throw new UnauthorizedException(result.message);
      case 403:
        throw new ForbiddenException(result.message);
      case 422:
        throw new UnprocessableEntityException(result.message);
      default:
        throw new Error('Unhandled status code: ' + result.statusCode);
    }
  }
}
