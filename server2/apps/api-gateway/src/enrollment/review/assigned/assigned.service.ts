import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApproveOrDenyAttachmentPayload,
  ApproveOrDenyAttachmentReturn,
  GradeLevelsReturn,
  RequirementsReturn,
  SectionsReturn,
  StudentsAssignedReturn,
  StudentsUnassignedReturn,
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

  async getAllStudentsUnassigned(gradeLevelId: number) {
    const result: StudentsUnassignedReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_assigned:get_all_students_unassigned_by_grade_level',
        },
        { gradeLevelId },
      ),
    );

    return result;
  }

  async getAllRequiermentsByStudent(studentId: number) {
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
        }),
      ),
    );
    return result;
  }
}
