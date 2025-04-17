import { Module } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { DashboardPieGraphController } from './dashboard-pie-graph.controller';

@Module({
  providers: [DashboardPieGraphService],
  controllers: [DashboardPieGraphController],
})
export class DashboardPieGraphModule {}
