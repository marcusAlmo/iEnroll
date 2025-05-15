import { Controller, Get } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('history-and-logs')
export class HistoryAndLogsController {
  constructor(private readonly historyAndLogsService: HistoryAndLogsService) {}

  @Get('retrieve-history-logs')
  async retrieveHistoryLogs(@User('school_id') schoolId: number) {
    return this.historyAndLogsService.retrieveHistoryLogs({ schoolId });
  }
}
