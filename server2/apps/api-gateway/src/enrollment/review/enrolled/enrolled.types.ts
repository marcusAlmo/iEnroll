import { EnrolledController } from 'apps/enrollment/src/review/enrolled/enrolled.controller';

export type GradeLevelsReturn = Awaited<
  ReturnType<EnrolledController['getAllGradeLevelsBySchool']>
>;

export type SectionsReturn = Awaited<
  ReturnType<EnrolledController['getAllSectionsByGradeLevel']>
>;

export type StudentsEnrolledBySectionReturn = Awaited<
  ReturnType<EnrolledController['getAllStudentsEnrolledBySection']>
>;

export type StudentsEnrolledByGradeLevelReturn = Awaited<
  ReturnType<EnrolledController['getAllStudentsEnrolledByGradeLevel']>
>;

export type StudentsEnrolledBySchoolReturn = Awaited<
  ReturnType<EnrolledController['getAllStudentsEnrolledBySchool']>
>;
