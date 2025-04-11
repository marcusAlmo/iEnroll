import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  getEnrolleeDetails(payload: object) {
    return this.client.send(
      {
        cmd: 'get_enrollment_details',
      },
      payload,
    );
  }

  getEnrollmentStatus(payload: object) {
    return this.client.send(
      {
        cmd: 'get_enrollment_status',
      },
      payload,
    );
  }
}
