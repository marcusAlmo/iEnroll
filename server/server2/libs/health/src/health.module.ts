// server/server2/libs/health/src/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { PrismaService } from '../../prisma/src/prisma.service';
import { RabbitMQHealthIndicator } from './rabbitmq.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [RabbitMQHealthIndicator, PrismaService],
})
export class HealthModule {}
