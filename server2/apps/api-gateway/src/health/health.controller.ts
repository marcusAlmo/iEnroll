import { Controller, Get, Query } from '@nestjs/common';
import { PrismaHealthIndicator } from './lib/prisma.health';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './lib/rabbitmq.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly healthCheckService: HealthCheckService,
    private readonly rmqHealth: RabbitMQHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(@Query('strict') strict?: boolean) {
    return this.healthCheckService.check([
      () => this.rmqHealth.isHealthy('rabbitmq', { strict }),
      async () => await this.prismaHealth.isHealthy('db'),
    ]);
  }
}
