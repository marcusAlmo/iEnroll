import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EnrolleeDetailsReturn,
  EnrollmentStatusReturn,
} from './dashboard.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getEnrolleeDetails(payload: object) {
    const result: EnrolleeDetailsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_enrollment_details',
        },
        payload,
      ),
    );
    return result;
  }

  async getEnrollmentStatus(payload: object) {
    const result: EnrollmentStatusReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_enrollment_status',
        },
        payload,
      ),
    );
    return result;
  }
}
