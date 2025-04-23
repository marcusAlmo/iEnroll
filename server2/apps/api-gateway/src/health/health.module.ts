import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './lib/prisma.health';
import { HealthController } from './health.controller';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { TerminusModule } from '@nestjs/terminus';
import { RabbitMQHealthIndicator } from './lib/rabbitmq.health';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator, PrismaService, RabbitMQHealthIndicator],
})
export class HealthModule {}
