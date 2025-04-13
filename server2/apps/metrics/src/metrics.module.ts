import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { ConfigModule /**, ConfigService */ } from '@nestjs/config';
import { MetricsService } from './metrics/metrics.service';
import { DashboardModule } from './dashboard/dashboard.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: false,
    }),
    DashboardModule,
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
