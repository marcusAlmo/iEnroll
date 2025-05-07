import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApproveOrDenyAttachmentPayload,
  ApproveOrDenyAttachmentReturn,
  EnrollStudentPayload,
  EnrollStudentReturn,
  GradeLevelsReturn,
  ReassignSectionPayload,
  ReassignSectionReturn,
  RequirementsReturn,
  SectionsReturn,
  StudentsAssignedReturn,
  StudentsUnassignedReturn,
  UpdateEnrollmentPayload,
  UpdateEnrollmentReturn,
} from './assigned.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AssignedService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getAllGradeLevelsBySchool(schoolId: number) {
    const result: GradeLevelsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_grade_levels_by_school',
        },
        { schoolId },
      ),
    );

    return result;
  }

  async getAllSectionsByGradeLevel(gradeLevelId: number) {
    const result: SectionsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_sections_by_grade_level',
        },
        { gradeLevelId },
      ),
    );

    return result;
  }

  async getAllStudentsAssigned(sectionId: number) {
    const result: StudentsAssignedReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_students_assigned_by_section',
        },
        { sectionId },
      ),
    );

    return result;
  }

  async getAllStudentsUnassigned(gradeSectionProgramId: number | number[]) {
    const result: StudentsUnassignedReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_section_program',
        },
        { gradeSectionProgramId: gradeSectionProgramId },
      ),
    );

    return result;
  }
  // async getAllStudentsUnassigned(gradeLevelId: number) {
  //   const result: StudentsUnassignedReturn = await lastValueFrom(
  //     this.client.send(
  //       {
  //         cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_level',
  //       },
  //       { gradeLevelId },
  //     ),
  //   );

  //   return result;
  // }

  async getAllRequirementsByStudent(studentId: number) {
    const result: RequirementsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_requirements_by_student',
        },
        { studentId },
      ),
    );

    return result;
  }
  async approveOrDenyAttachment(payload: {
    applicationId: number;
    requirementId: number;
    action: 'approve' | 'deny';
    reviewerId: number;
    remarks?: string;
  }) {
    const injectPayload = (payload: ApproveOrDenyAttachmentPayload) => payload;

    const result: ApproveOrDenyAttachmentReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:approve_or_deny_attachment',
        },
        injectPayload({
          applicationId: payload.applicationId,
          requirementId: payload.requirementId,
          action: payload.action,
          reviewerId: payload.reviewerId,
          remarks: payload.remarks,
        }),
      ),
    );
    return result;
  }
  async enrollStudent(payload: {
    studentId: number;
    sectionId: number;
    approverId: number;
    enrollmentRemarks?: string;
  }) {
    const injectPayload = (payload: EnrollStudentPayload) => payload;

    const result: EnrollStudentReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:enroll_student',
        },
        injectPayload({
          studentId: payload.studentId,
          sectionId: payload.sectionId,
          approverId: payload.approverId,
          enrollmentRemarks: payload.enrollmentRemarks,
        }),
      ),
    );
    return result;
  }
  async reassignStudentIntoDifferentSection(payload: {
    studentId: number;
    sectionId: number;
  }) {
    const injectPayload = (payload: ReassignSectionPayload) => payload;

    const result: ReassignSectionReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:reassign_student_into_diff_section',
        },
        injectPayload({
          studentId: payload.studentId,
          sectionId: payload.sectionId,
        }),
      ),
    );
    return result;
  }

  async updateEnrollmentStatus(payload: {
    status: 'accepted' | 'denied' | 'invalid';
    studentId: number;
  }) {
    const injectPayload = (payload: UpdateEnrollmentPayload) => payload;

    const result: UpdateEnrollmentReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:update_enrollment_status',
        },
        injectPayload({
          status: payload.status,
          studentId: payload.studentId,
        }),
      ),
    );
    return result;
  }
}
