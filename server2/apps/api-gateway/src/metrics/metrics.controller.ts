import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

// metrics.controller.ts
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics() {
    return this.metricsService.getMetrics();
  }
}
