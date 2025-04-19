import { Module } from '@nestjs/common';
import { CardsModule } from './dashboard/cards/cards.module';
import { PieGraphModule } from './dashboard/pie-graph/pie-graph.module';
import { EnrollmentTrendDataModule } from './dashboard/enrollment-trend-data/enrollment-trend-data.module';
import { PlanCapacityModule } from './dashboard/plan-capacity/plan-capacity.module';

@Module({
  imports: [
    CardsModule,
    PieGraphModule,
    EnrollmentTrendDataModule,
    PlanCapacityModule,
  ],
})
export class MetricsModule {}
