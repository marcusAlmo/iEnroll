import { Module } from '@nestjs/common';
import { CreateAccountModule } from './create-account/create-account.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollModule } from './enroll/enroll.module';
import { LandingModule } from './landing/landing.module';
import { RouterModule } from '@nestjs/core';
import { mapModulesToBasePath } from '@lib/utils/router.utils';
import { EnrollmentManagementModule } from './enrollment-management/enrollment-management.module';

const BASE_PATH = 'enrollment';

@Module({
  imports: [
    CreateAccountModule,
    DashboardModule,
    EnrollModule,
    LandingModule,
    RouterModule.register(
      mapModulesToBasePath(BASE_PATH, [
        CreateAccountModule,
        DashboardModule,
        EnrollModule,
        LandingModule,
      ]),
    ),
    EnrollmentManagementModule,
  ],
})
export class EnrollmentModule {}
