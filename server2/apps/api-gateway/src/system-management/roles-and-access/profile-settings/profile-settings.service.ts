import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProfileSettings } from 'apps/system-management/src/roles-and-access/profile-settings/interface/profile-settings.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProfileSettingsService {
  constructor(
    @Inject('SYSTEM_MANAGEMENT') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async updateProfileSettings(
    payload: object,
  ): Promise<ProfileSettings['response']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'update-profile-settings' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as ProfileSettings['response'];
  }

  public async getEmployeeInfo(
    payload: object,
  ): Promise<ProfileSettings['employeeInfo']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-employee-info' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as ProfileSettings['employeeInfo'];
  }

  public async createEmployee(
    payload: object,
  ): Promise<ProfileSettings['response']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'create-employee' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as ProfileSettings['response'];
  }
}
