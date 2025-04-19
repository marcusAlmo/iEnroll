import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PlanCapacity } from 'apps/metrics/src/dashboard/plan-capacity/interface/plan-capacity.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PlanCapacityService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionChecker: ExceptionCheckerService,
  ) {}

  async getPlanCapacity(payload: object): Promise<PlanCapacity['finalOutput']> {
    console.log('payload', payload);
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'plan-capacity' }, payload),
    );

    await this.exceptionChecker.checker(result);

    return result.data as PlanCapacity['finalOutput'];
  }
}
