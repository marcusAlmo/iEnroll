import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('partner-school')
  async getPartnerSchools() {
    return await this.dashboardService.getPartnerSchools();
  }

  @Get('announcement')
  async getAnnouncements() {
    return await this.dashboardService.getAnnouncements();
  }
}
