import { Controller, Get, Param, Query } from '@nestjs/common';
import { EnrolledService } from './enrolled.service';
import { User } from '@lib/decorators/user.decorator';

@Controller('enrolled')
export class EnrolledController {
  constructor(private readonly enrolledService: EnrolledService) {}

  @Get('grade-levels')
  async getAllGradeLevelsBySchool(@User('school_id') schoolId: number) {
    return this.enrolledService.getAllGradeLevelsBySchool(schoolId);
  }
  @Get('sections/:gradeLevelId')
  async getAllSectionsByGradeLevel(
    @Param('gradeLevelId') gradeLevelId: number,
  ) {
    return this.enrolledService.getAllSectionsByGradeLevel(gradeLevelId);
  }
  @Get('students/section/:sectionId')
  async getAllStudentsEnrolledBySection(
    @Param('sectionId') sectionId: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.enrolledService.getAllStudentsEnrolledBySection(
      sectionId,
      keyword,
    );
  }
  @Get('students/grade-level/:gradeLevelId')
  async getAllStudentsEnrolledByGradeLevel(
    @Param('gradeLevelId') gradeLevelId: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.enrolledService.getAllStudentsEnrolledByGradeLevel(
      gradeLevelId,
      keyword,
    );
  }
  @Get('students/school')
  async getAllStudentsEnrolledBySchool(
    @User('school_id') schoolId: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.enrolledService.getAllStudentsEnrolledBySchool(
      schoolId,
      keyword,
    );
  }
}
