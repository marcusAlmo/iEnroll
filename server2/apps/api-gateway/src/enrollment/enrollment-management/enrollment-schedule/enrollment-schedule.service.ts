import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EnrollmentSchedule } from 'apps/enrollment/src/enrollment-management/enrollment-schedule/interface/enrollment-schedule.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EnrollmentScheduleService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getAllGrades(
    payload: object,
  ): Promise<EnrollmentSchedule['gradeLevelFormat']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-all-schedules' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentSchedule['gradeLevelFormat'];
  }

  public async storeData(
    payload: object,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'store-data' }, { payload }),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as MicroserviceUtility['returnValue'];
  }

  public async pauseSchedule(
    payload: object,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'pause-schedule' }, { payload }),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as MicroserviceUtility['returnValue'];
  }

  public async deleteSchedule(
    payload: object,
  ): Promise<MicroserviceUtility['returnValue']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'delete-schedule' }, { payload }),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as MicroserviceUtility['returnValue'];
  }
}
