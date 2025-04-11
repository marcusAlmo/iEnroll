import { Controller, Get } from '@nestjs/common';
import { LandingService } from './landing.service';

@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Get('parner-school')
  getPartnerSchools() {
    return this.landingService.getPartnerSchools();
  }

  @Get('announcement')
  getAnnouncements() {
    return this.landingService.getAnnouncements();
  }
}
