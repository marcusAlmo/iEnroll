export interface ProfileSettings {
  employeeList: {
    name: string;
    role: string;
  };
  employeeInfo: {
    profileSettings: {
      personalInformation: {
        fName: string;
        mName: string;
        lName: string;
        suffix: string;
        birthDate: Date;
        gender: string;
      };
      contactInformation: {
        email: string;
        phone: string;
      };
      address: {
        streetAddress: string;
        street: string;
        district: string;
        municipality: string;
        province: string;
      };
    };
    accountSettings: {
      username: string;
      email: string;
    };
    roleManagement: {
      accessList: {
        accessListName: string;
        accessListPermission: string;
      }[];
      roleList: string;
    };
  };
}
