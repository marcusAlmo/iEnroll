import { DeniedController } from 'apps/enrollment/src/review/denied/denied.controller';

export type DeniedReturn = Awaited<
  ReturnType<DeniedController['getDeniedEnrollmentsBySchool']>
>;
