import { Controller } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('dashboard-pie-graph')
export class DashboardPieGraphController {
  constructor(private readonly pieGraphService: DashboardPieGraphService) {}

  @MessagePattern({ cmd: 'get-all-grades' })
  async getAllGrades(payload: { schoolId: number }) {
    console.log('payload2', payload);
    return await this.pieGraphService.getAllGrades(payload.schoolId);
  }
}
