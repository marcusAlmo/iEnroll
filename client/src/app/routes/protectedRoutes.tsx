import { Navigate, RouteObject } from "react-router";
import ProtectedStudentRoute from "../student/utils/ProtectedStudentRoute";
import { adminRoutes } from "./admin";
import ProtectedAdminRoute from "../admin/layouts/admin-layouts";
import { studentRoutes } from "./student/studentRoutes";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <ProtectedStudentRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />
      },
      ...studentRoutes
    ]
  },
  {
    path: "/admin", 
    element: <ProtectedAdminRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      ...adminRoutes
    ]
  }
];