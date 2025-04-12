import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnrollService } from './enroll.service';

@Controller('enroll')
@UseGuards(JwtAuthGuard)
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Get('school-selection')
  async getSchoolLevelAndScheduleSelection(
    @Query('school_id', ParseIntPipe) schoolId: number,
  ) {
    return await this.enrollService.getSchoolLevelAndScheduleSelection({
      id: schoolId,
    });
  }

  @Get('requirements')
  async getAllGradeSectionTypeRequirements(
    @Query('grade_section_program_id', ParseIntPipe)
    gradeSectionProgramId: number,
  ) {
    return await this.enrollService.getAllGradeSectionTypeRequirements({
      id: gradeSectionProgramId,
    });
  }

  @Get('payment')
  async getPaymentMethodDetails(
    @Query('grade_section_program_id', ParseIntPipe)
    gradeSectionProgramId: number,
  ) {
    return await this.enrollService.getPaymentMethodDetails({
      id: gradeSectionProgramId,
    });
  }

  // TODO: Finish submit payments and requirements
}
