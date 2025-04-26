import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import { User } from '@lib/decorators/user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('user/details')
  async getUserFirstName(@User('first_name') firstName: number) {
    return firstName;
  }

  @Get('enrollment/details')
  async getEnrolleeDetails(@User('user_id') studentId: number) {
    return await this.dashboardService.getEnrolleeDetails({ studentId });
  }

  @Get('enrollment/status')
  async getEnrolleeStatus(@User('user_id') studentId: number) {
    return await this.dashboardService.getEnrollmentStatus({ studentId });
  }

  @Get('enrollment/documents/re-upload')
  async getDocumentsForReupload(@User('user_id') studentId: number) {
    return await this.dashboardService.getDocumentsForReupload({
      studentId,
    });
  }

  @Get('downloadables')
  async getFileDownloadablesByStudent(
    @User('user_id') studentId: number,
    @User('school_id') userSchoolId: number,
  ) {
    return await this.dashboardService.getFileDownloadablesByStudent({
      studentId,
      userSchoolId,
    });
  }
}
