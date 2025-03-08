import { RouteObject } from "react-router";
import ProtectedStudentRoute from "../student/utils/ProtectedStudentRoute";
import DashboardPage from "../student/dashboard/DashboardPage";

export const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedStudentRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      }
    ]
  }
]