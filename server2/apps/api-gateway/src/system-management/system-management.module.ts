import { Module } from '@nestjs/common';
import { RoleAndAccessModule } from './roles-and-access/role-and-access.module';
@Module({
  imports: [RoleAndAccessModule],
})
export class SystemManagementModule {}
