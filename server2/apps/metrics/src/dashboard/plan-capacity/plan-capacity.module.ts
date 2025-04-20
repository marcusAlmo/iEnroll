import { Module } from '@nestjs/common';
import { PlanCapacityService } from './plan-capacity.service';
import { PlanCapacityController } from './plan-capacity.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
@Module({
  providers: [PlanCapacityService, PrismaService, MicroserviceUtilityService],
  exports: [PlanCapacityService],
  controllers: [PlanCapacityController],
})
export class PlanCapacityModule {}
