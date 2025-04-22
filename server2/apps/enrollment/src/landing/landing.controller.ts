import { Controller } from '@nestjs/common';
import { LandingService } from './landing.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @MessagePattern({ cmd: 'get_partner_schools' })
  async getPartnerSchools() {
    return await this.landingService.getPartnerSchools();
  }

  @MessagePattern({ cmd: 'get_announcements' })
  async getAnnouncements() {
    return await this.landingService.getAnnouncements();
  }
}
