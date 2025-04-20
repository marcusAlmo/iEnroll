import { Controller } from '@nestjs/common';
import { EnrollmentTrendDataService } from './enrollment-trend-data.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('enrollment-trend-data')
export class EnrollmentTrendDataController {
  constructor(
    private readonly enrollmentTrendDataService: EnrollmentTrendDataService,
  ) {}

  @MessagePattern({ cmd: 'enrollment-trend-data' })
  async getEnrollmentTrendData(payload: { schoolId: number }) {
    return await this.enrollmentTrendDataService.getEnrollmentTrendData(
      payload.schoolId,
    );
  }
}
