import { Controller, Put, Param, Body } from '@nestjs/common';
import { AccountSettingsService } from './account-settings.service';
import { AccountSettings } from './dto/account-settings.dto';

@Controller('account-settings')
export class AccountSettingsController {
  constructor(
    private readonly accountSettingsService: AccountSettingsService,
  ) {}

  @Put('update-account-settings/:id')
  async updateAccountSettings(
    @Param('id') id: string,
    @Body() payload: AccountSettings,
  ) {
    return this.accountSettingsService.updateAccountSettings({
      employeeId: Number(id),
      updateData: payload,
    });
  }
}
