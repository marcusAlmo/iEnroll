interface Street {
  streetId: number;
  street: string;
}

export type StreetReturn = Street[];

interface District {
  districtId: number;
  district: string;
  streets: Street[];
}

export type DistrictReturn = Omit<District, "streets">[];

interface Municipality {
  municipalityId: number;
  municipality: string;
  districts: District[];
}

export type MunicipalityReturn = Omit<Municipality, "districts">[];

interface Province {
  provinceId: number;
  province: string;
  municipalities: Municipality[];
}

export type ProvinceReturn = Omit<Province, "municipalities">[];

export type AddressReturn = Province[];
