import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from '@libs/prisma/src/prisma.health';
import { CircuitBreakerService } from '@libs/circuit-breaker/circuit-breaker.service';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly breaker: CircuitBreakerService,
    private readonly prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.prismaHealth.check(), // ✅ Ensure this returns a Promise<HealthIndicatorResult>
    ]);
  }
}
