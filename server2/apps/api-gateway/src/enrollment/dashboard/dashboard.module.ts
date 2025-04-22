import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.ENROLLMENT])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
