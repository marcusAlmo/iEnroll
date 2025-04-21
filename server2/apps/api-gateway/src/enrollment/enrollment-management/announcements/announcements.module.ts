import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController, ExceptionCheckerService],
})
export class AnnouncementsModule {}
