import { Controller } from '@nestjs/common';
import { AssignedService } from './assigned.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AssignedController {
  constructor(private readonly assignedService: AssignedService) {}

  @MessagePattern({
    cmd: 'enrollment_review_assigned:get_all_grade_levels_by_school',
  })
  async getAllGradeLevelsBySchool(@Payload() payload: { schoolId: number }) {
    return await this.assignedService.getAllGradeLevelsBySchool(
      payload.schoolId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:get_all_sections_by_grade_level',
  })
  async getAllSectionsByGradeLevel(
    @Payload() payload: { gradeLevelId: number },
  ) {
    return await this.assignedService.getAllSectionsByGradeLevel(
      payload.gradeLevelId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:get_all_students_assigned_by_section',
  })
  async getAllStudentsAssigned(
    @Payload()
    payload: {
      sectionId: number;
    },
  ) {
    return await this.assignedService.getAllStudentsAssigned(payload.sectionId);
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_level',
  })
  async getAllStudentsUnassigned(
    @Payload()
    payload: {
      gradeLevelId: number;
    },
  ) {
    return await this.assignedService.getAllStudentsUnassigned(
      payload.gradeLevelId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:get_all_requirements_by_student',
  })
  async getAllRequiermentsByStudent(
    @Payload()
    payload: {
      studentId: number;
    },
  ) {
    return await this.assignedService.getAllRequiermentsByStudent(
      payload.studentId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:approve_or_deny_attachment',
  })
  async approveOrDenyAttachment(
    @Payload()
    payload: {
      action: 'deny' | 'approve';
      applicationId: number;
      requirementId: number;
      reviewerId: number;
      remarks?: string;
    },
  ) {
    return await this.assignedService.approveOrDenyAttachment(
      payload.action,
      payload.applicationId,
      payload.requirementId,
      payload.reviewerId,
      payload.remarks,
    );
  }
}
