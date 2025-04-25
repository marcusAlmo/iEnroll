import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { User } from '@lib/decorators/user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('enrollment-details')
  async getEnrolleeDetails(@User('user_id') studentId: number) {
    return await this.dashboardService.getEnrolleeDetails({ studentId });
  }

  @Get('enrollment-status')
  async getEnrolleeStatus(@User('user_id') studentId: number) {
    return await this.dashboardService.getEnrollmentStatus({ studentId });
  }
}
