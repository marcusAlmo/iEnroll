import { $Enums } from '@prisma/client';

export interface RoleManagement {
  updateRoleManagement: {
    role: $Enums.role_type;
    dashboardAccess: $Enums.access_type_access_list;
    enrollmentReview: $Enums.access_type_access_list;
    enrollmentManagement: $Enums.access_type_access_list;
    personnelCenter: $Enums.access_type_access_list;
    systemSettings: $Enums.access_type_access_list;
  };

  response: {
    message: string;
  };
}
