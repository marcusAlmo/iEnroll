import { Controller } from '@nestjs/common';
import { EnrolledService } from './enrolled.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EnrolledController {
  constructor(private readonly enrolledService: EnrolledService) {}

  @MessagePattern({
    cmd: 'enrollment_review_enrolled:get_all_grade_levels_by_school',
  })
  async getAllGradeLevelsBySchool(@Payload() payload: { schoolId: number }) {
    return this.enrolledService.getAllGradeLevelsBySchool(payload.schoolId);
  }

  @MessagePattern({
    cmd: 'enrollment_review_enrolled:get_all_sections_by_grade_level',
  })
  async getAllSectionsByGradeLevel(
    @Payload() payload: { gradeLevelId: number },
  ) {
    return this.enrolledService.getAllSectionsByGradeLevel(
      payload.gradeLevelId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_enrolled:get_all_enrolled_students_enrolled_by_section',
  })
  async getAllStudentsEnrolledBySection(
    @Payload() payload: { sectionId: number },
  ) {
    return this.enrolledService.getAllStudentsEnrolledBySection(
      payload.sectionId,
    );
  }
}
