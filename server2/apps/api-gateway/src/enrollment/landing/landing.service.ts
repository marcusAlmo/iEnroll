import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class LandingService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  getPartnerSchools() {
    return this.client.send(
      {
        cmd: 'get_partner_schools',
      },
      {},
    );
  }

  getAnnouncements() {
    return this.client.send(
      {
        cmd: 'get_announcements',
      },
      {},
    );
  }
}
