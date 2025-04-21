import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController, ExceptionCheckerService],
=======
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
>>>>>>> b8d262f438509b0d5617d2b04ef8c4e9f95f96e8
})
export class AnnouncementsModule {}
