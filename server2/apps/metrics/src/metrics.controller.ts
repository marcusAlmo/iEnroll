import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MetricsController {
  @MessagePattern({ cmd: 'get_metrics' })
  getMetrics() {
    return { message: 'Request to add tarrifs on china' };
  }
}
