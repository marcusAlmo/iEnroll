import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Module } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { HistoryAndLogsController } from './history-and-logs.controller';
import { StringUtilityService } from '@lib/string-utility/string-utility.service';

@Module({
  providers: [
    HistoryAndLogsService,
    PrismaService,
    MicroserviceUtilityService,
    StringUtilityService,
  ],
  controllers: [HistoryAndLogsController],
})
export class HistoryAndLogsModule {}
