<<<<<<< HEAD
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '@libs/prisma/src/prisma.health';
import { CircuitBreakerService } from '@libs/circuit-breaker/circuit-breaker.service';
import { Controller, Get } from '@nestjs/common';
=======
// libs/health/src/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './rabbitmq.health';
import { PrismaService } from 'libs/prisma/src/prisma.service';
>>>>>>> dev-front-merge

@Controller('health')
export class HealthController {
  constructor(
<<<<<<< HEAD
    private readonly health: HealthCheckService,
    private readonly breaker: CircuitBreakerService,
    private readonly prismaHealth: PrismaHealthIndicator,
=======
    private health: HealthCheckService,
    private rmqHealth: RabbitMQHealthIndicator,
    private prisma: PrismaService,
>>>>>>> dev-front-merge
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
<<<<<<< HEAD
      async () => this.prismaHealth.check(), // ✅ Ensure this returns a Promise<HealthIndicatorResult>
=======
      () => this.rmqHealth.isHealthy('rabbitmq'),
      async () => this.prisma.$queryRaw`SELECT 1`.then(() => ({ db: { status: 'up' } }))
>>>>>>> dev-front-merge
    ]);
  }
}
