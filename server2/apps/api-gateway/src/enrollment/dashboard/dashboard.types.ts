import { DashboardController } from 'apps/enrollment/src/dashboard/dashboard.controller';

export type EnrolleeDetailsReturn = Awaited<
  ReturnType<DashboardController['getEnrollmentDetails']>
>;

export type EnrollmentStatusReturn = Awaited<
  ReturnType<DashboardController['getEnrollmentStatus']>
>;

export type DocumentsReuploadStatusReturn = Awaited<
  ReturnType<DashboardController['getDocumentsForReupload']>
>;

export type FileDownloadablesReturn = Awaited<
  ReturnType<DashboardController['getFileDownloadablesByStudent']>
>;
