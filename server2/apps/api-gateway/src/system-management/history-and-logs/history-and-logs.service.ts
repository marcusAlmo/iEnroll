import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HistoryAndLogs } from 'apps/system-management/src/history-and-logs/interface/history-and-logs.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HistoryAndLogsService {
  constructor(
    @Inject('SYSTEM_MANAGEMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async retrieveHistoryLogs(
    payload: object,
  ): Promise<HistoryAndLogs['processedHistoryLogs'][]> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'retrieve-history-logs' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as HistoryAndLogs['processedHistoryLogs'][];
  }
}
