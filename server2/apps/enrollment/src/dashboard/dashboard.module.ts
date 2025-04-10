import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { AuthModule } from '@lib/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [DashboardService, PrismaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
