import { Module } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { RoleManagementController } from './role-management.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  providers: [RoleManagementService],
  controllers: [
    RoleManagementController,
    PrismaService,
    MicroserviceUtilityService,
  ],
})
export class RoleManagementModule {}
