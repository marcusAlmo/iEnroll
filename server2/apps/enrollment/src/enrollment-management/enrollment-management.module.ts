import { Module } from '@nestjs/common';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SchoolClassificationModule } from './school-classification/school-classification.module';
import { SchoolDetailsModule } from './school-details/school-details.module';
import { GradeLevelsModule } from './grade-levels/grade-levels.module';
import { FeesModule } from './fees/fees.module';
import { EnrollmentScheduleModule } from './enrollment-schedule/enrollment-schedule.module';
import { RequirementsModule } from './requirements/requirements.module';

@Module({
  imports: [
    AnnouncementsModule,
    SchoolClassificationModule,
    SchoolDetailsModule,
    GradeLevelsModule,
    FeesModule,
    EnrollmentScheduleModule,
    RequirementsModule,
  ],
})
export class EnrollmentManagementModule {}
