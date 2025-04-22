import { Module } from '@nestjs/common';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SchoolClassificationModule } from './school-classification/school-classification.module';

@Module({
  imports: [AnnouncementsModule, SchoolClassificationModule],
})
export class EnrollmentManagementModule {}
