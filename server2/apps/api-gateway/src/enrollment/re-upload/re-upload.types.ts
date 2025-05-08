import { ReUploadController } from 'apps/enrollment/src/re-upload/re-upload.controller';

export type RequirementsForReuploadReturn = Awaited<
  ReturnType<ReUploadController['getAllRequirementsForReupload']>
>;
export type ResubmitInvalidRequirementsReturn = Awaited<
  ReturnType<ReUploadController['resubmitInvalidRequirements']>
>;
export type ResubmitInvalidRequirementsPayload = Parameters<
  ReUploadController['resubmitInvalidRequirements']
>[0];
