import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { lastValueFrom } from 'rxjs';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Fees } from 'apps/enrollment/src/enrollment-management/fees/interface/fees.interface';

@Injectable()
export class FeesService {
  constructor(
    @Inject('ENROLLMENT_SERVICE')
    private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async gettGradeLevelsAndFees(payload: object) {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-grade-levels-and-fees' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as Fees['fetchValue'][];
  }

  public async saveFees(schoolId: number, receivedData: Fees['receivedData']) {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'save-fees' }, { schoolId, receivedData }),
    );
    console.log(result);

    await this.exceptionCheckerService.checker(result);

    return result.data as { message: string };
  }
}
