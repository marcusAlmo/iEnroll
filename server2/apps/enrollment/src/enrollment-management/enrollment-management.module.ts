import { Module } from '@nestjs/common';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SchoolClassificationModule } from './school-classification/school-classification.module';
import { SchoolDetailsModule } from './school-details/school-details.module';
import { GradeLevelsModule } from './grade-levels/grade-levels.module';
import { FeesModule } from './fees/fees.module';

@Module({
  imports: [AnnouncementsModule, SchoolClassificationModule, SchoolDetailsModule, GradeLevelsModule, FeesModule],
})
export class EnrollmentManagementModule {}
