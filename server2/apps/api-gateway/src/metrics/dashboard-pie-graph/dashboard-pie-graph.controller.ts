import { Controller, Get } from '@nestjs/common';
import { DashboardPieGraphService } from './dashboard-pie-graph.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('dashboard-pie-graph')
export class DashboardPieGraphController {
  constructor(private readonly pieGraphService: DashboardPieGraphService) {}

  @Get('all-grades')
  async getAllGrades(@User('school_id') schoolId: number) {
    schoolId = 762306;
    return await this.pieGraphService.getAllGrades({ schoolId });
  }
}
