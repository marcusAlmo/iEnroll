import { Module } from '@nestjs/common';
import { RoleAndAccessModule } from './roles-and-access/role-and-access.module';
import { HistoryAndLogsModule } from './history-and-logs/history-and-logs.module';
@Module({
  imports: [RoleAndAccessModule, HistoryAndLogsModule],
})
export class SystemManagementModule {}
