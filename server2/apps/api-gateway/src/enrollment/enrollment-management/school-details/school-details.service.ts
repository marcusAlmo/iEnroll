import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ExceptionCheckerService } from './../../../../../../libs/exception-checker/exception-checker.service';
import { Inject, Injectable } from '@nestjs/common';
import { SchoolDetails } from 'apps/enrollment/src/enrollment-management/school-details/interface/school-details.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class SchoolDetailsService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getSchoolDetails(
    payload: object,
  ): Promise<SchoolDetails['scholarDetails']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'retrieve-schoool-details' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as SchoolDetails['scholarDetails'];
  }

  public async saveSchoolDetails(
    payload: object,
  ): Promise<{ message: string }> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'save-school-details' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as { message: string };
  }
}
