export interface CreateAccountBody {
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: Date | string; // Keep as string if input, will be transformed to Date
  gender: "M" | "F" | "O";
  schoolId: number;

  // Optional address identifiers
  streetId?: number;
  districtId?: number;
  municipalityId?: number;
  provinceId?: number;

  // Optional string-based address details
  street?: string;
  district?: string;
  municipality?: string;
  province?: string;

  enrollerId?: number;
}
