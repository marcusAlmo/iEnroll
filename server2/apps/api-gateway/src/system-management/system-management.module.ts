import { Module } from '@nestjs/common';
import { RolesAndAccessModule } from './roles-and-access/roles-and-access.module';

@Module({
  imports: [RolesAndAccessModule]
})
export class SystemManagementModule {}
