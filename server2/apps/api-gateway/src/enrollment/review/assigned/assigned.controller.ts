import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { ApproveOrDenyDto } from './dtos/requirement.dto';
import { User } from '@lib/decorators/user.decorator';
import {
  EnrollDto,
  ReassignDto,
  UpdateEnrollmentDto,
} from './dtos/enrollment.dto';
import { JwtAuthGuard } from '@lib/auth/guards/jwt-auth.guard';

@Controller('assigned')
@UseGuards(JwtAuthGuard)
export class AssignedController {
  constructor(private readonly assignedService: AssignedService) {}

  @Get('grade-levels')
  async getAllGradeLevelsBySchool(@User('school_id') schoolId: number) {
    return await this.assignedService.getAllGradeLevelsBySchool(schoolId);
  }

  @Get('sections/:gradeLevelId')
  async getAllSectionsByGradeLevel(
    @Param('gradeLevelId', ParseIntPipe) gradeLevelId: number,
  ) {
    return await this.assignedService.getAllSectionsByGradeLevel(gradeLevelId);
  }

  @Get('students/assigned/:sectionId')
  async getAllStudentsAssigned(
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    return await this.assignedService.getAllStudentsAssigned(sectionId);
  }

  @Get('students/unassigned/:gradeSectionProgramId')
  async getAllStudentsUnassigned(
    @Param('gradeSectionProgramId') gradeSectionProgramId: string, // Accepts the parameter as string to handle comma separation
  ) {
    const gradeSectionProgramIds = gradeSectionProgramId
      .split(',')
      .map((id) => {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
          throw new BadRequestException(
            'ERR_GRADE_SECTION_PROGRAM_ID_INVALID_TYPE',
          );
        }
        return parsedId;
      });

    // Pass either a single number or an array of numbers to the service
    return await this.assignedService.getAllStudentsUnassigned(
      gradeSectionProgramIds,
    );
  }
  // @Get('students/unassigned/:gradeLevelId')
  // async getAllStudentsUnassigned(
  //   @Param('gradeLevelId', ParseIntPipe) gradeLevelId: number,
  // ) {
  //   return await this.assignedService.getAllStudentsUnassigned(gradeLevelId);
  // }

  @Get('requirements/:studentId')
  async getAllRequiermentsByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return await this.assignedService.getAllRequirementsByStudent(studentId);
  }

  @Post('requirements/approve-or-deny')
  async approveOrDenyRequirements(
    @Body() approveOrDenyDto: ApproveOrDenyDto,
    @User('user_id') reviewerId: number,
  ) {
    return await this.assignedService.approveOrDenyAttachment({
      ...approveOrDenyDto,
      reviewerId,
    });
  }

  @Post('enroll')
  async enrollStudent(
    @Body() enrollDto: EnrollDto,
    @User('user_id') approverId: number,
  ) {
    console.log('APPROVER', approverId);

    return await this.assignedService.enrollStudent({
      ...enrollDto,
      approverId,
    });
  }

  @Post('section/reassign')
  async reassignStudentIntoDifferentSection(@Body() reassignDto: ReassignDto) {
    return await this.assignedService.reassignStudentIntoDifferentSection({
      ...reassignDto,
    });
  }

  @Patch('enrollment/status')
  async updateEnrollmentStatus(
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return await this.assignedService.updateEnrollmentStatus({
      ...updateEnrollmentDto,
    });
  }
}
