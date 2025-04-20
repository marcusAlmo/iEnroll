import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

    if (result.statusCode == 404) throw new NotFoundException(result.message);
    else if (result.statusCode == 500)
      throw new InternalServerErrorException(result.message);
  }
}
