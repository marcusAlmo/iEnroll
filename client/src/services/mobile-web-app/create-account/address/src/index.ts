import { instance } from "@/lib/axios";
import {
  AddressReturn,
  DistrictReturn,
  MunicipalityReturn,
  ProvinceReturn,
  StreetReturn,
} from "../types";
import {
  getAddresses,
  getDistrictsByMunicipalityId,
  getMunicipalitiesByProvinceId,
  getProvinces,
  getStreetsByDistrictId,
} from "../test";

export const getAllAddresses = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<AddressReturn>(
      "/api/enrollment/create-account/address",
    );
  } else {
    return { data: getAddresses() };
  }
};

export const getAllProvinces = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<ProvinceReturn>(
      "/api/enrollment/create-account/address/province",
    );
  } else {
    return { data: getProvinces() };
  }
};

export const getAllMunicipalitiesByProvinceId = async (provinceId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<MunicipalityReturn>(
      `/api/enrollment/create-account/address/municipality/${provinceId}`,
    );
  } else {
    return { data: getMunicipalitiesByProvinceId(provinceId) };
  }
};

export const getAllDistrictsByMunicipalityId = async (
  municipalityId: number,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<DistrictReturn>(
      `/api/enrollment/create-account/address/district/${municipalityId}`,
    );
  } else {
    return { data: getDistrictsByMunicipalityId(municipalityId) };
  }
};

export const getAllStreetsByDistrictId = async (districtId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<StreetReturn>(
      `/api/enrollment/create-account/address/street/${districtId}`,
    );
  } else {
    return { data: getStreetsByDistrictId(districtId) };
  }
};
