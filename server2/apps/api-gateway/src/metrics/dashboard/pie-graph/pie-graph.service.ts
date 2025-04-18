import { Inject, Injectable } from '@nestjs/common';
import {
  DashboardPieGraph,
  PieGraphData,
} from './interface/dashboard-pie-graph.interface';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
@Injectable()
export class PieGraphService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getAllGrades(
    payload: object,
  ): Promise<DashboardPieGraph['gradeLevels']> {
    console.log('payload1', payload);
    const result: DashboardPieGraph['gradeLevels'] = await lastValueFrom(
      this.client.send({ cmd: 'get-all-grades' }, payload),
    );

    return result;
  }

  public async getPieGraphData(payload: object): Promise<PieGraphData> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-pie-graph-data' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as PieGraphData;
  }
}
