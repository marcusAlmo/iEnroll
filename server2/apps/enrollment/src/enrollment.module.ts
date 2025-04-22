import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountModule } from './create-account/create-account.module';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { EnrollModule } from './enroll/enroll.module';
import { LandingModule } from './landing/landing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnrollmentManagementModule } from './enrollment-management/enrollment-management.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    CreateAccountModule,
    PrismaModule,
    EnrollModule,
    LandingModule,
    DashboardModule,
    EnrollmentManagementModule,
  ],
  providers: [],
})
export class EnrollmentModule {}
