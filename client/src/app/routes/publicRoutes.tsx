import { Navigate, RouteObject } from "react-router";
import Home from "../Home";
import LoginPage from "../student/authentication/LoginPage";
import SignUpPage from "../student/authentication/SignUpPage";
import CredentialsPage from "../admin/authentication/CredentialsPage";
import Dashboard from "../admin/pages/Dashboard";
import EnrollmentReview from "../admin/pages/EnrollmentReview";
import EnrollmentManagement from "../admin/pages/EnrollmentManagement";
import ContactSection from "../admin/components/ContactSection";
import EnrollmentBreakdown from "../admin/components/EnrollmentBreakdown";
import EnrollmentTrend from "../admin/components/EnrollmentTrend";
import EnrollmentCount from "../admin/components/EnrollmentCount";
import PlanCapacity from "../admin/components/PlanCapacity";
import Layout from "../admin/layouts/admin-layouts";
import PersonnelCenter from "../admin/pages/PersonnelCenter";
import PricingList from "../admin/components/PricingList";
import MeetOurPartners from "../MeetOurPartners";
import WarningPage from "../student/WarningPage";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/log-in",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/admin-credentials",
    element: <CredentialsPage />,
  },
  {
    path: "/meet-our-partners",
    element: <MeetOurPartners />,
  },
  {
    path: "/iEnroll",
    element: <WarningPage />,
  },
  {
    path: "/meet-our-partners",
    element: <MeetOurPartners />,
  },
  {
    path: "/iEnroll",
    element: <WarningPage />,
  },
  {
    path: "/admin",
    element: <Layout />, // Admin layout wraps all routes
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
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
      {
        path: "enrollment-review",
        element: <EnrollmentReview />,
      },
      {
        path: "enrollment-management",
        element: <EnrollmentManagement />,
      },
      {
        path: "personnel-management",
        element: <PersonnelCenter />,
      },
    ],
  },
  {
    path: "/admin-contact-section",
    element: <ContactSection />,
  },
  {
    path: "/admin-pricing-list",
    element: <PricingList />,
  },
];
