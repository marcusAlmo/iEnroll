export interface SchoolDetails {
  scholarDetails: {
    schoolName: string;
    schoolContact: string;
    streetId: number | null;
    schoolEmail: string;
    schoolWebUrl: string | null;
    schoolAddress: string | null;
    street: string | null;
    district: string | null;
    districtId: number | null;
    municipality: string | null;
    municipalityId: number | null;
    province: string | null;
    provinceId: number | null;
    schoolId: number | null;
  };

  receiveInput: {
    schoolContact: string;
    schoolEmail: string;
    schoolName: string;
    schoolAddress: string;
    schoolWebUrl: string;
    streetId: number;
    schoolId: number;
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

  relatedTables: {
    user: number[];
    gradeLevelOffered: number[];
    paymentOption: number[];
    schoolSubscription: number[];
    schoolAcadYear: number[];
  };
}
