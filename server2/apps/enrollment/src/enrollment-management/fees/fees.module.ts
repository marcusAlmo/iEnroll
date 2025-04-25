import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  providers: [FeesService, PrismaService, MicroserviceUtilityService],
  controllers: [FeesController]
})
export class FeesModule {}
