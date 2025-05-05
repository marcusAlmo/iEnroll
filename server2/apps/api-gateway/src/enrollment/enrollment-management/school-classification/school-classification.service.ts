import { lastValueFrom } from 'rxjs';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SchoolClassification } from 'apps/enrollment/src/enrollment-management/school-classification/interface/school-classification.interface';

@Injectable()
export class SchoolClassificationService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async saveSchoolClassification(
    payload: object,
  ): Promise<SchoolClassification['successMessage']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'save-school-classification' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as SchoolClassification['successMessage'];
  }

  public async getAllGradesLavels(
    payload: object,
  ): Promise<SchoolClassification['finalOutput']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-all-grade-levels' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as SchoolClassification['finalOutput'];
  }
}
