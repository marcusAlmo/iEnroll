import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':id/enrollment-details')
  getEnrolleeDetails(@Param('id', ParseIntPipe) studentId: number) {
    return this.dashboardService.getEnrolleeDetails({ studentId });
  }

  @Get(':id/enrollment-status')
  getEnrolleeStatus(@Param('id', ParseIntPipe) studentId: number) {
    return this.dashboardService.getEnrollmentStatus({ studentId });
  }
}
