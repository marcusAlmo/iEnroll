import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, PrismaService, MicroserviceUtilityService],
})
export class AnnouncementsModule {}
