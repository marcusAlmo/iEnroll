import { Module } from '@nestjs/common';
import { CreateAccountModule } from './create-account/create-account.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollModule } from './enroll/enroll.module';
import { LandingModule } from './landing/landing.module';
import { RouterModule } from '@nestjs/core';
import { mapModulesToBasePath } from '@lib/utils/router.utils';
import { EnrollmentManagementModule } from './enrollment-management/enrollment-management.module';
import { AnnouncementsModule } from './enrollment-management/announcements/announcements.module';
import { ReviewModule } from './review/review.module';

const BASE_PATH = 'enrollment';

@Module({
  imports: [
    CreateAccountModule,
    DashboardModule,
    EnrollModule,
    LandingModule,
    AnnouncementsModule,
    RouterModule.register(
      mapModulesToBasePath(BASE_PATH, [
        CreateAccountModule,
        DashboardModule,
        EnrollModule,
        LandingModule,
      ]),
    ),
    EnrollmentManagementModule,
    ReviewModule,
  ],
})
export class EnrollmentModule {}
