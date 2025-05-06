import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountSettingsService } from './account-settings.service';
import { AccountSettings } from './interface/account-settings.interface';

@Controller('account-settings')
export class AccountSettingsController {
  constructor(
    private readonly accountSettingsService: AccountSettingsService,
  ) {}

  @MessagePattern({ cmd: 'account-settings-update' })
  public async updateAccountSettings(payload: {
    employeeId: number;
    updateData: AccountSettings['updateAccountSettings'];
  }) {
    return this.accountSettingsService.updateAccountSettings(
      payload.employeeId,
      payload.updateData,
    );
  }

  @MessagePattern({ cmd: 'account-settings-update-password' })
  public async updatePassword(payload: {
    employeeId: number;
    password: string;
  }) {
    return this.accountSettingsService.updatePassword(
      payload.employeeId,
      payload.password,
    );
  }
}
