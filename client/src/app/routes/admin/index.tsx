import { RouteObject } from "react-router";
import { dashboardRoutes } from "./dashboardRoutes";
import { enrollmentReviewRoutes } from "./enrollmentReviewRoutes";
import { personnelManagementRoutes } from "./personnelManagementRoutes";
import ContactSection from "../../admin/components/ContactSection";
import PricingList from "../../admin/components/PricingList";
import { enrollmentManagementRoutes } from "./enrollmentManagementRoutes";
import Settings from "@/app/admin/pages/settings/Settings";

/**
 * Defines the routes for the admin section of the application.
 * 
 * This array combines routes from various modules such as:
 * - `dashboardRoutes`: Routes related to the admin dashboard.
 * - `enrollmentReviewRoutes`: Routes for reviewing enrollments.
 * - `personnelManagementRoutes`: Routes for managing personnel.
 * 
 * Additionally, it includes specific routes for:
 * - `/contact-section`: Displays the `ContactSection` component.
 * - `/pricing-list`: Displays the `PricingList` component.
 * 
 * Each route object in the array adheres to the `RouteObject` interface.
 */

export const adminRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...enrollmentReviewRoutes,
  ...enrollmentManagementRoutes,
  ...personnelManagementRoutes,
  {
    path: "contact-section",
    element: <ContactSection />,
  },
  {
    path: "pricing-list",
    element: <PricingList />,
  },
  {
    path: "settings",
    element: <Settings />
  }
];