import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [PrismaService, DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
