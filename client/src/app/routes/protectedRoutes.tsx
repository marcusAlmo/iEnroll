import { Navigate, RouteObject } from "react-router";
import ProtectedStudentRoute from "../student/utils/ProtectedStudentRoute";
import DashboardPage from "../student/dashboard/DashboardPage";
import { adminRoutes } from "./admin";
import ProtectedAdminRoute from "../admin/layouts/admin-layouts";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/student/dashboard",
    element: <ProtectedStudentRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      }
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