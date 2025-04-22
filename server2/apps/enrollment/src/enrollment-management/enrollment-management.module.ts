import { Module } from '@nestjs/common';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SchoolClassificationModule } from './school-classification/school-classification.module';
import { SchoolDetailsModule } from './school-details/school-details.module';

@Module({
  imports: [AnnouncementsModule, SchoolClassificationModule, SchoolDetailsModule],
})
export class EnrollmentManagementModule {}
