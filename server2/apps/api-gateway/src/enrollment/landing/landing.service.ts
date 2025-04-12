import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AnnouncementsReturn, PartnerSchoolsReturn } from './landing.types';

@Injectable()
export class LandingService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getPartnerSchools() {
    const result: PartnerSchoolsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_partner_schools',
        },
        {},
      ),
    );
    return result;
  }

  async getAnnouncements() {
    const result: AnnouncementsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_announcements',
        },
        {},
      ),
    );
    return result;
  }
}
