import { Controller, Get, UseGuards } from '@nestjs/common';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('metrics/enrollment-trend-data')
@UseGuards(JwtAuthGuard)
export class EnrollmentTrendDataController {
  constructor(
    private readonly enrollmentTrendDataService: EnrollmentTrendDataService,
  ) {}

  @Get('data')
  async getEnrollmentTrend(@User('school_id') schoolId: number) {
    schoolId = 762306;
    return await this.enrollmentTrendDataService.getEnrollmentTrendData({
      schoolId,
    });
  }
}
