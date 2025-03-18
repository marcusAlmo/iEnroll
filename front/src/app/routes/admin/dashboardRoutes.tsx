import { RouteObject } from "react-router";
import Dashboard from "../../admin/pages/Dashboard";
import EnrollmentBreakdown from "../../admin/components/EnrollmentBreakdown";
import EnrollmentCount from "../../admin/components/EnrollmentCount";
import EnrollmentTrend from "../../admin/components/EnrollmentTrend";
import PlanCapacity from "../../admin/components/PlanCapacity";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <Dashboard />, // Dashboard layout with <Outlet />
    children: [
      { path: "enrollment-breakdown", element: <EnrollmentBreakdown /> },
      { path: "enrollment-trend", element: <EnrollmentTrend /> },
      { path: "enrollment-count", element: <EnrollmentCount /> },
      { path: "plan-capacity", element: <PlanCapacity /> },
    ],
  },
];