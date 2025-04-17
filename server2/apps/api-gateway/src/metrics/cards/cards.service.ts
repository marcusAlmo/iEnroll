import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrollmentTotal } from 'apps/metrics/src/cards/interfaces/cards.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CardsService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getEnrollmentTotal(payload: object): Promise<EnrollmentTotal> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'enrollment-total' }, payload),
    );

    await this.checker(result);

    return result.data as EnrollmentTotal;
  }

  async getAcceptedEnrollmentTotal(payload: {
    schoolId: number;
  }): Promise<EnrollmentTotal> {
    console.log('payload1', payload);
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'accepted-enrollment-total' }, payload),
    );

    await this.checker(result);

    return result.data as EnrollmentTotal;
  }

  async getInvalidOrDeniedEnrollmentTotal(payload: {
    schoolId: number;
  }): Promise<EnrollmentTotal> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'invalid-or-denied-enrollment-total' }, payload),
    );

    await this.checker(result);

    return result.data as EnrollmentTotal;
  }

  private async checker(
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
