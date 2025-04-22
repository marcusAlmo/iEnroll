import { CreateAccountController } from 'apps/enrollment/src/create-account/create-account.controller';

export type CreateReturn = Awaited<
  ReturnType<CreateAccountController['create']>
>;
export type GetAllSchoolsReturn = Awaited<
  ReturnType<CreateAccountController['getAllSchools']>
>;
export type GetAllAddressesReturn = Awaited<
  ReturnType<CreateAccountController['getAllAddresses']>
>;
