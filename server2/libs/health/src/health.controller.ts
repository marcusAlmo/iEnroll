// libs/health/src/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private rmqHealth: RabbitMQHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.rmqHealth.isHealthy('rabbitmq'),
      async () =>
        this.prisma.$queryRaw`SELECT 1`.then(() => ({ db: { status: 'up' } })),
    ]);
  }
}
