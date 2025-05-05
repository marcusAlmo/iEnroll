import { Module } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { HistoryAndLogsController } from './history-and-logs.controller';

@Module({
  providers: [HistoryAndLogsService],
  controllers: [HistoryAndLogsController]
})
export class HistoryAndLogsModule {}
