import { RouteObject } from "react-router";
import EnrollmentManagement from "../../admin/pages/EnrollmentManagement";

export const enrollmentManagementRoutes: RouteObject[] = [
  {
    path: "enrollment-management",
    element: <EnrollmentManagement />
  }
];