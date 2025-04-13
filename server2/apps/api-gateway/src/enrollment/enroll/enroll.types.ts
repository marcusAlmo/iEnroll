import { EnrollService } from 'apps/enrollment/src/enroll/enroll.service';

export type SelectionReturn = Awaited<
  ReturnType<EnrollService['getSchoolLevelAndScheduleSelection']>
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
  ReturnType<EnrollService['submitRequirement']>
>;
