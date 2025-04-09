import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment.controller';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountModule } from './create-account/create-account.module';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { EnrollModule } from './enroll/enroll.module';
import { DashboardModule } from './dashboard/dashboard.module';
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
    DashboardModule,
  ],
  controllers: [EnrollmentController],
  providers: [],
})
export class EnrollmentModule {}
