import { Module } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { GradeLevelsController } from './grade-levels.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  providers: [GradeLevelsService, PrismaService, MicroserviceUtilityService],
  controllers: [GradeLevelsController],
})
export class GradeLevelsModule {}
