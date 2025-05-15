import { Controller, Put, Param, Body } from '@nestjs/common';
import { AccountSettingsService } from './account-settings.service';
import { AccountSettings, UpdatePassword } from './dto/account-settings.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('account-settings')
@UseGuards(JwtAuthGuard)
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

  @Put('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() payload: UpdatePassword,
  ) {
    return this.accountSettingsService.updatePassword({
      employeeId: Number(id),
      password: payload.password,
    });
  }
}
