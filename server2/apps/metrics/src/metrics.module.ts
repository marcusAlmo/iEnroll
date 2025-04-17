import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import configuration from './config/configuration';
import { CardsModule } from './cards/cards.module';
import { DashboardPieGraphModule } from './dashboard-pie-graph/dashboard-pie-graph.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    CardsModule,
    DashboardPieGraphModule,
  ],
  controllers: [MetricsController],
  providers: [],
})
export class MetricsModule {}
