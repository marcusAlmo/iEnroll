import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// metrics.service.ts
@Injectable()
export class EnrollmentService {
  // eslint-disable-next-line
  constructor(@Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy) {}

  getEnrollments() {
    return this.client.send({ cmd: 'get_enrollments' }, {});
  }
}
