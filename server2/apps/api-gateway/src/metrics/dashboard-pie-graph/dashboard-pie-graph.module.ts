import { Module } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { DashboardPieGraphController } from './dashboard-pie-graph.controller';
import { AuthModule } from '@lib/auth/auth.module';
import { ClientsModule } from '@nestjs/microservices';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';

@Module({
  imports: [AuthModule, ClientsModule.register([rabbitMQConstants.METRICS])],
  providers: [DashboardPieGraphService],
  controllers: [DashboardPieGraphController],
})
export class DashboardPieGraphModule {}
