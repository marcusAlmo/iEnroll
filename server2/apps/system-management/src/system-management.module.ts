import { Module } from '@nestjs/common';
import { SystemManagementController } from './system-management.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AccountSettingsModule } from './roles-and-access/account-settings/account-settings.module';
import { ProfileSettingsModule } from './roles-and-access/profile-settings/profile-settings.module';
import { EmployeeListModule } from './roles-and-access/employee-list/employee-list.module';
import { RoleManagementModule } from './roles-and-access/role-management/role-management.module';
import { HistoryAndLogsModule } from './history-and-logs/history-and-logs.module';

@Module({
  imports: [
    AccountSettingsModule,
    ProfileSettingsModule,
    EmployeeListModule,
    RoleManagementModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    HistoryAndLogsModule,
  ],
  controllers: [SystemManagementController],
  providers: [],
})
export class SystemManagementModule {}
