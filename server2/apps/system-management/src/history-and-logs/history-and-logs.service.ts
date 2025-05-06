import { StringUtilityService } from '@lib/string-utility/string-utility.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { HistoryAndLogs } from './interface/history-and-logs.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

@Injectable()
export class HistoryAndLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
    private readonly stringUtilityService: StringUtilityService,
  ) {}

  public async retrieveHistoryLogs(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const rawHistoryLogs: HistoryAndLogs['convertedHistoryLogsRaw'][] | number =
      await this.retrieveHistoryLogsRaw(schoolId);

    if (typeof rawHistoryLogs === 'number') {
      if (rawHistoryLogs === 1) {
        return this.microserviceUtilityService.badRequestExceptionReturn(
          'Please complete the date range',
        );
      } else {
        return this.microserviceUtilityService.notFoundExceptionReturn(
          'No history logs found',
        );
      }
    }

    const processedHistory: HistoryAndLogs['processedHistoryLogs'][] =
      rawHistoryLogs.map((e) => {
        return {
          initiator: e.initiator,
          role: e.role,
          systemAction: e.system_action,
          details: `${
            e.details.success ? 'Success' : 'Failed'
          } ${e.details.actionDetails}`,
          logDatetime: e.log_datetime,
        };
      });

    return this.microserviceUtilityService.returnSuccess(processedHistory);
  }

  // UTILITY FUNCTION
  private async retrieveHistoryLogsRaw(
    schoolId: number,
  ): Promise<HistoryAndLogs['convertedHistoryLogsRaw'][] | number> {
    const historyRaw: HistoryAndLogs['rawHistoryLogs'][] | null =
      await this.prisma.system_log.findMany({
        where: {
          school_id: schoolId,
        },
        select: {
          initiator: true,
          system_action: true,
          details: true,
          log_datetime: true,
          role: true,
        },
        orderBy: {
          log_datetime: 'desc',
        },
      });

    if (!historyRaw) return 2;

    return historyRaw as HistoryAndLogs['convertedHistoryLogsRaw'][];
  }
}
