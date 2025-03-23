// health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
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
})
export class HealthModule {}
