// import { Controller, Get, Inject } from '@nestjs/common';
// import { ApiGatewayService } from './api-gateway.service';
// import { ClientProxy } from '@nestjs/microservices';

import { Controller, Get } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';

@Controller()
export class ApiGatewayController {
  constructor(
    private readonly apiGatewayService: ApiGatewayService,
    // @Inject('METRICS_SERVICE') private readonly metricsClient: ClientProxy,
    // @Inject('SYSTEM_MANAGEMENT_SERVICE')
    // private readonly systemManagementClient: ClientProxy,
    // @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.apiGatewayService.getHello();
  }
}
