import { Module } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { DashboardPieGraphController } from './dashboard-pie-graph.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  providers: [DashboardPieGraphService, ExceptionCheckerService],
  controllers: [DashboardPieGraphController],
})
export class DashboardPieGraphModule {}
