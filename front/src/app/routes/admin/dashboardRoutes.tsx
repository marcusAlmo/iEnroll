import { RouteObject } from "react-router";
import Dashboard from "../../admin/pages/Dashboard";
import EnrollmentBreakdown from "@/app/admin/pages/dashboard/enrollment-breakdown/enrollmentbreakdown";
import EnrollmentCount from "@/app/admin/pages/dashboard/enrollment-count/enrollmentcount";
import EnrollmentTrend from "@/app/admin/pages/dashboard/enrollment-trend/enrollmenttrend";
import PlanCapacity from "@/app/admin/pages/dashboard/plan-capacity/plancapacity";

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