import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';
import { CardsModule } from './dashboard/cards/cards.module';
import { PieGraphModule } from './dashboard/pie-graph/pie-graph.module';
import { EnrollmentTrendDataModule } from './dashboard/enrollment-trend-data/enrollment-trend-data.module';
import { PlanCapacityService } from './dashboard/plan-capacity/plan-capacity.service';
import { PlanCapacityController } from './dashboard/plan-capacity/plan-capacity.controller';
import { PlanCapacityModule } from './dashboard/plan-capacity/plan-capacity.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    CardsModule,
    PieGraphModule,
    EnrollmentTrendDataModule,
    PlanCapacityModule,
  ],
  controllers: [MetricsController, PlanCapacityController],
  providers: [PlanCapacityService],
})
export class MetricsModule {}
