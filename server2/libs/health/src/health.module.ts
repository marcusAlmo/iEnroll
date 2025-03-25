// health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from '@libs/prisma/src/prisma.health'; // Add this
import { PrismaModule } from '@libs/prisma/src/prisma.module';
import { CircuitBreakerModule } from '@libs/circuit-breaker/circuit-breaker.module';

@Module({
  // prettier-ignore
  imports: [
    TerminusModule,
    CircuitBreakerModule,
    PrismaModule,
  ],
  // prettier-ignore
  providers: [
    PrismaHealthIndicator
  ],
  // prettier-ignore
  controllers: [HealthController],
})
export class HealthModule {}
