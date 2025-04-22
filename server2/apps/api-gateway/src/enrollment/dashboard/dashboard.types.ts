import { DashboardService } from 'apps/enrollment/src/dashboard/dashboard.service';

export type EnrolleeDetailsReturn = Awaited<
  ReturnType<DashboardService['getEnrollmentDetails']>
>;

export type EnrollmentStatusReturn = Awaited<
  ReturnType<DashboardService['getEnrollmentStatus']>
>;
