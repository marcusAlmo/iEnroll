import { Controller, Get } from '@nestjs/common';
import { DeniedService } from './denied.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('denied')
export class DeniedController {
  constructor(private readonly deniedService: DeniedService) {}

  @Get('enrollments')
  async getDeniedEnrollmentsBySchool(@User('school_id') schoolId: number) {
    return this.deniedService.getDeniedEnrollmentsBySchool(schoolId);
  }
}
