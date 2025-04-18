import { Controller } from '@nestjs/common';
import { PieGraphService } from './pie-graph.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('pie-graph')
export class PieGraphController {
  constructor(private readonly pieGraphService: PieGraphService) {}

  @MessagePattern({ cmd: 'get-all-grades' })
  async getAllGrades(payload: { schoolId: number }) {
    console.log('payload2', payload);
    return await this.pieGraphService.getAllGrades(payload.schoolId);
  }

  @MessagePattern({ cmd: 'get-pie-graph-data' })
  async getPieGraphData(payload: { schoolId: number }) {
    return await this.pieGraphService.getPieGraphData(payload.schoolId);
  }
}
