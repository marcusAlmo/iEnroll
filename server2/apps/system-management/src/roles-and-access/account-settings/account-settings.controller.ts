import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountSettingsService } from './account-settings.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { AccountSettings } from './interface/account-settings.interface';

@Controller('account-settings')
export class AccountSettingsController {
  constructor(
    private readonly accountSettingsService: AccountSettingsService,
  ) {}

  @MessagePattern('account-settings.update')
  public async updateAccountSettings(
    data: AccountSettings,
  ): Promise<MicroserviceUtility['returnValue']> {
    return this.accountSettingsService.updateAccountSettings(data);
  }
}
