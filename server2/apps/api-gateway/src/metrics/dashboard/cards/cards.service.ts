import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrollmentDataInterface } from 'apps/metrics/src/dashboard/cards/interfaces/cards.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CardsService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  async getEnrollmentData(payload: object): Promise<EnrollmentDataInterface> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'data' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentDataInterface;
  }
}
