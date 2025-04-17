import { Inject, Injectable } from '@nestjs/common';
import { DashboardPieGraph } from './interface/dashboard-pie-graph.interface';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DashboardPieGraphService {
  constructor(
    @Inject('METRICS_SERVICE') private readonly client: ClientProxy,
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
}
