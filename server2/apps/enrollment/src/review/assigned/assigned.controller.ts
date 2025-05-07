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
    cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_section_program',
  })
  async getAllStudentsUnassigned(
    @Payload()
    payload: {
      gradeSectionProgramId: number | number[];
    },
  ) {
    return await this.assignedService.getAllStudentsUnassigned(
      payload.gradeSectionProgramId,
    );
  }
  // @MessagePattern({
  //   cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_level',
  // })
  // async getAllStudentsUnassigned(
  //   @Payload()
  //   payload: {
  //     gradeLevelId: number;
  //   },
  // ) {
  //   return await this.assignedService.getAllStudentsUnassigned(
  //     payload.gradeLevelId,
  //   );
  // }

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

  @MessagePattern({
    cmd: 'enrollment_review_assigned:enroll_student',
  })
  async enrollStudent(
    @Payload()
    payload: {
      studentId: number;
      sectionId: number;
      approverId: number;
      enrollmentRemarks?: string;
    },
  ) {
    return await this.assignedService.enrollStudent(
      payload.studentId,
      payload.sectionId,
      payload.approverId,
      payload.enrollmentRemarks,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:reassign_student_into_diff_section',
  })
  async reassignStudentIntoDifferentSection(
    @Payload()
    payload: {
      studentId: number;
      sectionId: number;
    },
  ) {
    return await this.assignedService.reassignStudentIntoDifferentSection(
      payload.studentId,
      payload.sectionId,
    );
  }

  @MessagePattern({
    cmd: 'enrollment_review_assigned:update_enrollment_status',
  })
  async updateEnrollmentStatus(
    @Payload()
    payload: {
      status: 'accepted' | 'denied' | 'invalid';
      studentId: number;
    },
  ) {
    return await this.assignedService.updateEnrollmentStatus(
      payload.status,
      payload.studentId,
    );
  }
}
