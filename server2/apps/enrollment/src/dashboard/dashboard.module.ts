import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '@lib/prisma/src/prisma.module';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { FileCommonService } from '@lib/file-common/file-common.service';

@Module({
  imports: [PrismaModule],
  providers: [DashboardService, PrismaService, FileCommonService],
  controllers: [DashboardController],
})
export class DashboardModule {}
