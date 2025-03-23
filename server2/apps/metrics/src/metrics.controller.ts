import { Controller, Get } from '@nestjs/common';

@Controller()
export class MetricsController {
  @Get()
  getHello(): string {
    return 'Other people achieved success at a young age, it is too late, give up';
  }
}
