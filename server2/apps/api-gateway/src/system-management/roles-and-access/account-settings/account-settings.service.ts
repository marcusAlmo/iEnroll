import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AccountSettings } from 'apps/system-management/src/roles-and-access/account-settings/interface/account-settings.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountSettingsService {
  constructor(
    @Inject('SYSTEM_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async updateAccountSettings(
    payload: object,
  ): Promise<AccountSettings['response']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'account-settings-update' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as AccountSettings['response'];
  }
}
