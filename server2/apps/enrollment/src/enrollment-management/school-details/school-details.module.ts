import { Module } from '@nestjs/common';
import { SchoolDetailsController } from './school-details.controller';
import { SchoolDetailsService } from './school-details.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  controllers: [SchoolDetailsController],
  providers: [SchoolDetailsService, PrismaService, MicroserviceUtilityService],
})
export class SchoolDetailsModule {}
