import { JsonValue } from '@prisma/client/runtime/library';

export interface HistoryAndLogs {
  rawHistoryLogs: {
    initiator: string;
    system_action: string;
    details: JsonValue;
    log_datetime: Date | null;
  };

  detailInfo: {
    success: boolean;
    actionDetails: string;
    role: string;
  };

  convertedHistoryLogsRaw: {
    initiator: string;
    system_action: string;
    details: HistoryAndLogs['detailInfo'];
    log_datetime: Date | null;
  };

  processedHistoryLogs: {
    initiator: string;
    role: string;
    systemAction: string;
    details: string;
    logDatetime: Date | null;
  };
}
