import { Inject, Injectable } from '@nestjs/common';
import { DeniedReturn } from './denied.types';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DeniedService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getDeniedEnrollmentsBySchool(schoolId: number) {
    const result: DeniedReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_denied:get_denied_enrollments_by_school',
        },
        { schoolId },
      ),
    );

    return result;
  }
}
