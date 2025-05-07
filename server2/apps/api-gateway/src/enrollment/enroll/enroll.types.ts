import { EnrollController } from 'apps/enrollment/src/enroll/enroll.controller';

export type SelectionReturn = Awaited<
  ReturnType<EnrollController['getSchoolLevelAndScheduleSelection']>
>;

export type AcademicLevelsReturn = Awaited<
  ReturnType<EnrollController['getAcademicLevelsBySchool']>
>;

export type GradeLevelsReturn = Awaited<
  ReturnType<EnrollController['getGradeLevelsByAcademicLevel']>
>;

export type SchedulesReturn = Awaited<
  ReturnType<EnrollController['getSchedulesByGradeLevel']>
>;

export type GradeSectionTypesReturn = Awaited<
  ReturnType<EnrollController['getGradeSectionTypesByGradeLevel']>
>;

export type SectionsReturn = Awaited<
  ReturnType<EnrollController['getSectionsByGradeLevel']>
>;

export type RequirementsReturn = Awaited<
  ReturnType<EnrollController['getAllGradeSectionTypeRequirements']>
>;

export type PaymentMethodsReturn = Awaited<
  ReturnType<EnrollController['getPaymentMethodDetails']>
>;

export type SubmitPaymentsReturn = Awaited<
  ReturnType<EnrollController['submitPayment']>
>;

export type SubmitRequirementsReturn = Awaited<
  ReturnType<EnrollController['submitRequirements']>
>;

export type ValidatePaymentOptionReturn = Awaited<
  ReturnType<EnrollController['validatePaymentOptionId']>
>;

export type CheckStudentAlreadyPaidReturn = Awaited<
  ReturnType<EnrollController['checkIfStudentIsALreadyPaid']>
>;

export type CheckRequirementIdsValidReturn = Awaited<
  ReturnType<EnrollController['checkIfAllRequirementIdsAreValid']>
>;

export type MakeStudentEnrollmentReturn = Awaited<
  ReturnType<EnrollController['makeStudentEnrollmentApplication']>
>;

export type MakeStudentEnrollmentPayload = Parameters<
  EnrollController['makeStudentEnrollmentApplication']
>[0];
