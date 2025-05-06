import { Controller, Post, Body } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { User } from '@lib/decorators/user.decorator';
import { HistoryAndLogsDto } from './dto/history-and-logs.dto';

@Controller('history-and-logs')
export class HistoryAndLogsController {
  constructor(private readonly historyAndLogsService: HistoryAndLogsService) {}

  @Post('retrieve-history-logs')
  async retrieveHistoryLogs(
    @User('school_id') schoolId: number,
    @Body() data: HistoryAndLogsDto,
  ) {
    schoolId = 388243;
    return this.historyAndLogsService.retrieveHistoryLogs({
      schoolId,
      role: data.role,
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }
}
