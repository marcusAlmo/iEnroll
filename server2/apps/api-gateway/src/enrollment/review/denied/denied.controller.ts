import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeniedService } from './denied.service';
import { User } from '@lib/decorators/user.decorator';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('denied')
@UseGuards(JwtAuthGuard)
export class DeniedController {
  constructor(private readonly deniedService: DeniedService) {}

  @Get()
  async getDeniedEnrollmentsBySchool(@User('school_id') schoolId: number) {
    return this.deniedService.getDeniedEnrollmentsBySchool(schoolId);
  }
}
