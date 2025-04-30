import { Module } from '@nestjs/common';
import { RequirementsService } from './requirements.service';
import { RequirementsController } from './requirements.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  providers: [RequirementsService, PrismaService, MicroserviceUtilityService],
  controllers: [RequirementsController],
})
export class RequirementsModule {}
