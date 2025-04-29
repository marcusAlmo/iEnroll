import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GradeLevels } from 'apps/enrollment/src/enrollment-management/grade-levels/interface/grade-levels.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class GradeLevelsService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getGradeLevels(
    payload: object,
  ): Promise<GradeLevels['gradeLevels']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-grade-levels' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as GradeLevels['gradeLevels'];
  }

  public async createAndUpdateGradeLevels(
    payload: object,
  ): Promise<{ message: string }> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'create-update-grade-levels' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as { message: string };
  }

  public async deleteGradeLevels(
    payload: object,
  ): Promise<{ message: string }> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'delete-grade-section' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as { message: string };
  }

  public async retrievePrograms(): Promise<GradeLevels['programList']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'retrieve-programs' }, {}),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as GradeLevels['programList'];
  }
}
