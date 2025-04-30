import { Module } from '@nestjs/common';
import { AccountSettingsModule } from './account-settings/account-settings.module';
import { ProfileSettingsModule } from './profile-settings/profile-settings.module';
import { RoleManagementModule } from './role-management/role-management.module';
import { EmployeeListModule } from './employee-list/employee-list.module';

@Module({
  imports: [
    AccountSettingsModule,
    ProfileSettingsModule,
    RoleManagementModule,
    EmployeeListModule,
  ],
})
export class RoleAndAccessModule {}
