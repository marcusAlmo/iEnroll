import { EnrollService } from 'apps/enrollment/src/enroll/enroll.service';

export type SelectionReturn = Awaited<
  ReturnType<EnrollService['getSchoolLevelAndScheduleSelection']>
>;

export type AcademicLevelsReturn = Awaited<
  ReturnType<EnrollService['getAcademicLevelsBySchool']>
>;

export type GradeLevelsReturn = Awaited<
  ReturnType<EnrollService['getGradeLevelsByAcademicLevel']>
>;

export type SchedulesReturn = Awaited<
  ReturnType<EnrollService['getSchedulesByGradeLevel']>
>;

export type GradeSectionTypesReturn = Awaited<
  ReturnType<EnrollService['getGradeSectionTypesByGradeLevel']>
>;

export type SectionsReturn = Awaited<
  ReturnType<EnrollService['getSectionsByGradeLevel']>
>;

export type RequirementsReturn = Awaited<
  ReturnType<EnrollService['getAllGradeSectionTypeRequirements']>
>;

export type PaymentMethodsReturn = Awaited<
  ReturnType<EnrollService['getPaymentMethodDetails']>
>;

export type SubmitPaymentsReturn = Awaited<
  ReturnType<EnrollService['submitPayment']>
>;

export type SubmitRequirementsReturn = Awaited<
  ReturnType<EnrollService['submitRequirements']>
>;

export type ValidatePaymentOptionReturn = Awaited<
  ReturnType<EnrollService['validatePaymentOptionId']>
>;

export type CheckStudentAlreadyPaidReturn = Awaited<
  ReturnType<EnrollService['checkIfStudentIsALreadyPaid']>
>;

export type CheckRequirementIdsValidReturn = Awaited<
  ReturnType<EnrollService['checkIfAllRequirementIdsAreValid']>
>;
