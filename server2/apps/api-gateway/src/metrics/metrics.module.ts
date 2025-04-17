import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { DashboardPieGraphModule } from './dashboard-pie-graph/dashboard-pie-graph.module';

@Module({
  imports: [CardsModule, DashboardPieGraphModule],
})
export class MetricsModule {}
