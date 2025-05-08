import DashboardPage from "@/app/student/dashboard/DashboardPage";
import EnrollmentRoute from "@/app/student/enrollment/EnrollmentRoute";
import StepOne from "@/app/student/enrollment/page/StepOne";
import StepTwo from "@/app/student/enrollment/page/StepTwo";
import ReuploadPage from "@/app/student/re-upload/page/ReUploadPage";
import { RouteObject } from "react-router";

export const studentRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "enroll",
    element: <EnrollmentRoute />,
    children: [
      {
        path: "step-1",
        element: <StepOne />,
      },
      {
        path: "step-2",
        element: <StepTwo />,
      },
    ],
  },
  {
    path: "re-upload",
    element: <ReuploadPage />,
  },
];
