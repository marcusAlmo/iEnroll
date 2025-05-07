import { lastValueFrom } from 'rxjs';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Requirements } from 'apps/enrollment/src/enrollment-management/requirements/interface/requirements.interface';
import { EnrollmentSchedule } from 'apps/enrollment/src/enrollment-management/enrollment-schedule/interface/enrollment-schedule.interface';

@Injectable()
export class RequirementsService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getAllRequirements(
    payload: object,
  ): Promise<Requirements['processedRequirements']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'retrieve-requirements' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as Requirements['processedRequirements'];
  }

  public async processReceivedData(
    payload: object,
  ): Promise<EnrollmentSchedule['processReturn']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'process-received-requirements' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentSchedule['processReturn'];
  }

  public async deleteRequirement(
    payload: object,
  ): Promise<EnrollmentSchedule['processReturn']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'delete-requirement' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentSchedule['processReturn'];
  }

  public async updateRequirement(
    payload: object,
  ): Promise<EnrollmentSchedule['processReturn']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'update-requirement' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as EnrollmentSchedule['processReturn'];
  }
}
