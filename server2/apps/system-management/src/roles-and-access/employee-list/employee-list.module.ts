import { Module } from '@nestjs/common';
import { EmployeeListService } from './employee-list.service';
import { EmployeeListController } from './employee-list.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { StringUtilityService } from '@lib/string-utility/string-utility.service';

@Module({
  providers: [EmployeeListService],
  controllers: [
    EmployeeListController,
    PrismaService,
    MicroserviceUtilityService,
    StringUtilityService,
  ],
})
export class EmployeeListModule {}
