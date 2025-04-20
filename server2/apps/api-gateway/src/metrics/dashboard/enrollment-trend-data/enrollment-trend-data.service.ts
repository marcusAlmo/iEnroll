import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrollmentTrendData } from 'apps/metrics/src/dashboard/enrollment-trend-data/interface/enrollment-trend-data.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EnrollmentTrendDataService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  async getEnrollmentTrendData(
    payload: object,
  ): Promise<EnrollmentTrendData['enrollmentRecord'][]> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'enrollment-trend-data' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentTrendData['enrollmentRecord'][];
  }
}
