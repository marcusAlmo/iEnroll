// health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
<<<<<<< HEAD
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
=======
import { PrismaService } from '../../prisma/src/prisma.service';
import { RabbitMQHealthIndicator } from './rabbitmq.health';

// prettier-ignore
@Module({
  imports: [TerminusModule],
  providers: [
    RabbitMQHealthIndicator,
    PrismaService
  ],
  controllers: [HealthController],
  exports: [TerminusModule] // Export TerminusModule instead of individual services
>>>>>>> dev-front-merge
})
export class HealthModule {}
