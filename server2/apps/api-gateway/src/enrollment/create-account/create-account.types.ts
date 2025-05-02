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

export type GetAllProvincesReturn = Awaited<
  ReturnType<CreateAccountController['getAllProvinces']>
>;
export type GetAllMunicipalitiesByProvinceIdReturn = Awaited<
  ReturnType<CreateAccountController['getAllMunicipalitiesByProvinceId']>
>;
export type GetAllDistrictsByMunicipalityIdReturn = Awaited<
  ReturnType<CreateAccountController['getAllDistrictsByMunicipalityId']>
>;
export type GetAllStreetsByDistrictIdReturn = Awaited<
  ReturnType<CreateAccountController['getAllStreetsByDistrictId']>
>;
