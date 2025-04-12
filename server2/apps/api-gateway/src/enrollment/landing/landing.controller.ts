import { Controller, Get } from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get('partner-school')
  async getPartnerSchools() {
    return await this.landingService.getPartnerSchools();
  }

  @Get('announcement')
  async getAnnouncements() {
    return await this.landingService.getAnnouncements();
  }
}
