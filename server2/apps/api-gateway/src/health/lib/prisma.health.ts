import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

@Injectable()
export class PrismaHealthIndicator {
  private readonly logger = new Logger(PrismaHealthIndicator.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.prismaService.$queryRawUnsafe('SELECT 1');

      return indicator.up();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown Prisma error';
      this.logger.error(`Prisma health check failed: ${message}`, err as any);
      return indicator.down(message);
    }
  }
}
