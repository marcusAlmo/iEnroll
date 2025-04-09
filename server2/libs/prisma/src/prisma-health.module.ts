import { Module } from '@nestjs/common';
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaHealthIndicator, PrismaService],
  exports: [PrismaHealthIndicator], // Export to make it available elsewhere
})
export class PrismaHealthModule {}
