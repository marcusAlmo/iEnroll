import { addressData } from "@/services/common/address/test/sample-data";
import {
  DistrictReturn,
  MunicipalityReturn,
  ProvinceReturn,
  StreetReturn,
} from "../types";

export const getAddresses = () => {
  return addressData;
};

export const getProvinces = (): ProvinceReturn => {
  return addressData.map((province) => {
    return {
      provinceId: province.provinceId,
      province: province.province,
    };
  });
};

export const getMunicipalitiesByProvinceId = (
  provinceId: number,
): MunicipalityReturn => {
  return (
    addressData
      .find((province) => province.provinceId === provinceId)
      ?.municipalities.map((municipality) => {
        return {
          municipalityId: municipality.municipalityId,
          municipality: municipality.municipality,
        };
      }) || []
  );
};

export const getDistrictsByMunicipalityId = (
  municipalityId: number,
): DistrictReturn => {
  return (
    addressData
      .flatMap((province) => province.municipalities)
      .find((municipality) => municipality.municipalityId === municipalityId)
      ?.districts.map((district) => {
        return {
          districtId: district.districtId,
          district: district.district,
        };
      }) || []
  );
};

export const getStreetsByDistrictId = (districtId: number): StreetReturn => {
  return (
    addressData
      .flatMap((province) =>
        province.municipalities.flatMap(
          (municipality) => municipality.districts,
        ),
      )
      .find((district) => district.districtId === districtId)
      ?.streets.map((street) => {
        return {
          streetId: street.streetId,
          street: street.street,
        };
      }) || []
  );
};
