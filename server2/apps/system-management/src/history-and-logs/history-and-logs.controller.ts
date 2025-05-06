import { Controller } from '@nestjs/common';
import { HistoryAndLogsService } from './history-and-logs.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('history-and-logs')
export class HistoryAndLogsController {
  constructor(private readonly historyAndLogsService: HistoryAndLogsService) {}

  @MessagePattern({ cmd: 'retrieve-history-logs' })
  async retrieveHistoryLogsController(payload: {
    schoolId: number;
    role: string | null;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    return this.historyAndLogsService.retrieveHistoryLogs(
      payload.schoolId,
      payload.role,
      payload.startDate,
      payload.endDate,
    );
  }
}
