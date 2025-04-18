import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrollmentTotal } from 'apps/metrics/src/dashboard/cards/interfaces/cards.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CardsService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  async getEnrollmentTotal(payload: object): Promise<EnrollmentTotal> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'enrollment-total' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentTotal;
  }

  async getAcceptedEnrollmentTotal(payload: {
    schoolId: number;
  }): Promise<EnrollmentTotal> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'accepted-enrollment-total' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentTotal;
  }

  async getInvalidOrDeniedEnrollmentTotal(payload: {
    schoolId: number;
  }): Promise<EnrollmentTotal> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'invalid-or-denied-enrollment-total' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentTotal;
  }
}
