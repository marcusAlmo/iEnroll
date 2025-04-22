import { Module } from '@nestjs/common';
import { SchoolClassificationController } from './school-classification.controller';
import { SchoolClassificationService } from './school-classification.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  controllers: [SchoolClassificationController],
  providers: [
    SchoolClassificationService,
    PrismaService,
    MicroserviceUtilityService,
  ],
})
export class SchoolClassificationModule {}
