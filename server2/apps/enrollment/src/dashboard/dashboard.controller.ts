import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { EnrollmentStatus } from './enums/enrollment-status.enum';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':id/enrollment-details')
  async getEnrollmentDetails(@Param('id', ParseIntPipe) studentId: number) {
    const result = await this.dashboardService.getEnrollmentDetails(studentId);
    if (!result) {
      throw new NotFoundException({
        message: 'Student not found',
        error: 'ERROR_STUDENT_NOT_FOUND',
      });
    }
    return result;
  }

  @Get(':id/enrollment-status')
  async getEnrollmentStatus(@Param('id', ParseIntPipe) studentId: number) {
    const result = await this.dashboardService.getEnrollmentStatus(studentId);

    switch (result) {
      case EnrollmentStatus.NOT_FOUND:
        throw new NotFoundException({
          message: 'Student not found',
          error: 'ERROR_STUDENT_NOT_FOUND',
        });
      case EnrollmentStatus.NOT_ENROLLED:
        throw new NotFoundException({
          message: 'Student not enrolled',
          error: 'ERROR_STUDENT_NOT_ENROLLED',
        });
      default:
        return result;
    }
  }
}
