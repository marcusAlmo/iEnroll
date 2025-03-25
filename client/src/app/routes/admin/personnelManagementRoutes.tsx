import { RouteObject } from "react-router";
import PersonnelCenter from "../../admin/pages/personnel-center/PersonnelCenter";

export const personnelManagementRoutes: RouteObject[] = [
  {
    path: "personnel-management",
    element: <PersonnelCenter />
  }
];