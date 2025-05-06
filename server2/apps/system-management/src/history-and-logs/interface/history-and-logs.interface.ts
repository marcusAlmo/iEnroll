import { JsonValue } from '@prisma/client/runtime/library';

export interface HistoryAndLogs {
  rawHistoryLogs: {
    initiator: string;
    system_action: string;
    details: JsonValue;
    log_datetime: Date | null;
    role: string;
  };

  detailInfo: {
    success: boolean;
    actionDetails: string;
  };

  convertedHistoryLogsRaw: {
    initiator: string;
    system_action: string;
    details: HistoryAndLogs['detailInfo'];
    log_datetime: Date | null;
    role: string;
  };

  processedHistoryLogs: {
    initiator: string;
    role: string;
    systemAction: string;
    details: string;
    logDatetime: Date | null;
  };
}
