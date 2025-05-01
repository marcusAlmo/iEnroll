export interface SchoolDetails {
  scholarDetails: {
    schoolName: string;
    schoolContact: string;
    schoolId: number | null;
    schoolEmail: string;
    schoolWebUrl: string | null;
    schoolAddress: string | null;
    street: string;
    district: string;
    municipality: string;
    province: string;
  };

  province: {
    provinceId: number;
    province: string;
  };

  municipality: {
    municipalityId: number;
    municipality: string;
  };

  district: {
    districtId: number;
    district: string;
  };

  street: {
    streetId: number;
    street: string;
  };
}
