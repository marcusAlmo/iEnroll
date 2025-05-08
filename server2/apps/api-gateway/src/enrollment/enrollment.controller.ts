import { Controller, Get } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

// metrics.controller.ts

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getEnrollments() {
    return this.enrollmentService.getEnrollments();
  }
}
