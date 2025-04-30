import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { ApproveOrDenyDto } from './dtos/requirement.dto';
import { User } from '@lib/decorators/user.decorator';

@Controller('assigned')
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

  @Get('students/unassigned/:gradeLevelId')
  async getAllStudentsUnassigned(
    @Param('gradeLevelId', ParseIntPipe) gradeLevelId: number,
  ) {
    return await this.assignedService.getAllStudentsUnassigned(gradeLevelId);
  }

  @Get('requirements/:studentId')
  async getAllRequiermentsByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return await this.assignedService.getAllRequiermentsByStudent(studentId);
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
}
