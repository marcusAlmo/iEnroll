import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  GradeLevelsReturn,
  SectionsReturn,
  StudentsEnrolledByGradeLevelReturn,
  StudentsEnrolledBySchoolReturn,
  StudentsEnrolledBySectionReturn,
} from './enrolled.types';

@Injectable()
export class EnrolledService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getAllGradeLevelsBySchool(schoolId: number) {
    const result: GradeLevelsReturn = await lastValueFrom(
      this.client.send(
        { cmd: 'enrollment_review_enrolled:get_all_grade_levels_by_school' },
        { schoolId },
      ),
    );
    return result;
  }

  async getAllSectionsByGradeLevel(gradeLevelId: number) {
    const result: SectionsReturn = await lastValueFrom(
      this.client.send(
        { cmd: 'enrollment_review_enrolled:get_all_sections_by_grade_level' },
        { gradeLevelId },
      ),
    );
    return result;
  }

  async getAllStudentsEnrolledBySection(sectionId: number, keyword?: string) {
    const result: StudentsEnrolledBySectionReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_enrolled:get_all_enrolled_students_enrolled_by_section',
        },
        { sectionId, keyword },
      ),
    );
    return result;
  }

  async getAllStudentsEnrolledByGradeLevel(
    gradeLevelId: number,
    keyword?: string,
  ) {
    const result: StudentsEnrolledByGradeLevelReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_enrolled:get_all_enrolled_students_enrolled_by_grade_level',
        },
        { gradeLevelId, keyword },
      ),
    );
    return result;
  }

  async getAllStudentsEnrolledBySchool(schoolId: number, keyword?: string) {
    const result: StudentsEnrolledBySchoolReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'enrollment_review_enrolled:get_all_enrolled_students_enrolled_by_school',
        },
        { schoolId, keyword },
      ),
    );
    return result;
  }
}
