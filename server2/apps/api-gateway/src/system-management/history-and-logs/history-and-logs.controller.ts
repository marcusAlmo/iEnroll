import { Controller, Get } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('history-and-logs')
@UseGuards(JwtAuthGuard)
export class HistoryAndLogsController {
  constructor(private readonly historyAndLogsService: HistoryAndLogsService) {}

  @Get('retrieve-history-logs')
  async retrieveHistoryLogs(@User('school_id') schoolId: number) {
    return this.historyAndLogsService.retrieveHistoryLogs({ schoolId });
  }
}
