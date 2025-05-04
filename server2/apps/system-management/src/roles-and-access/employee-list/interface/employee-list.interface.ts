export interface EmployeeList {
  employeeList: {
    userId: number;
    name: string;
    role: string;
  };

  queryUnsafeEmployeeList: {
    user_id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix: string;
    role: string;
  };
}
