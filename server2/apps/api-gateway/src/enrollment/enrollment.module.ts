import { Module } from '@nestjs/common';
import { CreateAccountModule } from './create-account/create-account.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollModule } from './enroll/enroll.module';
import { LandingModule } from './landing/landing.module';
import { RouterModule } from '@nestjs/core';
import { mapModulesToBasePath } from '@lib/utils/router.utils';

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
  ],
})
export class EnrollmentModule {}
