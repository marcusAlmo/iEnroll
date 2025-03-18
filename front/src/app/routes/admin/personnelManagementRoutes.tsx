import { RouteObject } from "react-router";
import PersonnelCenter from "../../admin/pages/PersonnelCenter";

export const personnelManagementRoutes: RouteObject[] = [
  {
    path: "personnel-management",
    element: <PersonnelCenter />
  }
];