import { $Enums } from '@prisma/client';
export interface ProfileSettings {
  updateProfileSettings: {
    fName: string;
    mName: string;
    lName: string;
    suffix: string;
    gender: $Enums.gender;
    phone: string;
  };

  createProfileSettings: ProfileSettings['updateProfileSettings'] & {
    username: string;
    password: string;
  };

  employeeInfo: {
    profileSettings: {
      personalInformation: {
        fName: string;
        mName: string;
        lName: string;
        suffix: string;
        gender: string;
      };
      contactInformation: {
        phone: string;
      };
    };
    accountSettings: {
      username: string;
      email: string;
    };
    roleManagement: {
      role: $Enums.role_type;
      dashboardAccess: $Enums.access_type_access_list;
      enrollmentReview: $Enums.access_type_access_list;
      enrollmentManagement: $Enums.access_type_access_list;
      personnelCenter: $Enums.access_type_access_list;
      systemSettings: $Enums.access_type_access_list;
    };
  };
}
