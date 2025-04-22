import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// metrics.service.ts
@Injectable()
export class MetricsService {
  // eslint-disable-next-line
  constructor(@Inject('METRICS_SERVICE') private readonly client: ClientProxy) {}

  getMetrics() {
    return this.client.send({ cmd: 'get_metrics' }, {});
  }
}
