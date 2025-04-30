import { Controller } from '@nestjs/common';
import { DeniedService } from './denied.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class DeniedController {
  constructor(private readonly deniedService: DeniedService) {}

  @MessagePattern({
    cmd: 'enrollment_review_denied:get_denied_enrollments_by_school',
  })
  async getDeniedEnrollmentsBySchool(schoolId: number) {
    return this.deniedService.getDeniedEnrollmentsBySchool(schoolId);
  }
}
