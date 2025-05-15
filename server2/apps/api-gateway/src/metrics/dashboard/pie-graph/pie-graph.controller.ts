import { Controller, Get, UseGuards } from '@nestjs/common';
import { PieGraphService } from './pie-graph.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('metrics/pie-graph')
@UseGuards(JwtAuthGuard)
export class PieGraphController {
  constructor(private readonly pieGraphService: PieGraphService) {}

  @Get('all-grades')
  async getAllGrades(@User('school_id') schoolId: number) {
    return await this.pieGraphService.getAllGrades({ schoolId });
  }

  @Get('data')
  async getPieGraphData(@User('school_id') schoolId: number) {
    return await this.pieGraphService.getPieGraphData({ schoolId });
  }
}
