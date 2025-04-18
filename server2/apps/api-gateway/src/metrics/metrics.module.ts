import { Module } from '@nestjs/common';
import { CardsModule } from './dashboard/cards/cards.module';
import { PieGraphModule } from './dashboard/pie-graph/pie-graph.module';
import { EnrollmentTrendDataModule } from './dashboard/enrollment-trend-data/enrollment-trend-data.module';

@Module({
  imports: [CardsModule, PieGraphModule, EnrollmentTrendDataModule],
})
export class MetricsModule {}
