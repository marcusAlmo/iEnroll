import { Controller, Get } from '@nestjs/common';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('metrics/enrollment-trend-data')
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
