import { RouteObject } from "react-router";
import EnrollmentReview from "../../admin/pages/enrollment-review/EnrollmentReview";
import Assigned from "@/app/admin/pages/enrollment-review/assigned/assignedIndex";
import Denied from "@/app/admin/pages/enrollment-review/denied/deniedIndex";
import Enrolled from "@/app/admin/pages/enrollment-review/enrolled/enrolledIndex";

export const enrollmentReviewRoutes: RouteObject[] = [
  {
    path: "enrollment-review",
    element: <EnrollmentReview />,
    children: [
      {
        index: true,
        element: <Assigned />,
      },
      {
        path: "denied",
        element: <Denied />,
      },
      {
        path: "enrolled",
        element: <Enrolled />,
      },
    ],
  },
];
