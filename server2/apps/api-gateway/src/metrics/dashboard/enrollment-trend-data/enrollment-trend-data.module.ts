import { Module } from '@nestjs/common';
import { EnrollmentTrendDataController } from './enrollment-trend-data.controller';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';

@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  controllers: [EnrollmentTrendDataController],
  providers: [EnrollmentTrendDataService, ExceptionCheckerService],
})
export class EnrollmentTrendDataModule {}
