import { CreateAccountService } from 'apps/enrollment/src/create-account/create-account.service';

export type CreateReturn = Awaited<ReturnType<CreateAccountService['create']>>;
export type GetAllSchoolsReturn = Awaited<
  ReturnType<CreateAccountService['getAllSchools']>
>;
