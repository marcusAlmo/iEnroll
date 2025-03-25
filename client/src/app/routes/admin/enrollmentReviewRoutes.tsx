import { RouteObject } from "react-router";
import EnrollmentReview from "../../admin/pages/enrollment-review/EnrollmentReview";
import Assigned from "@/app/admin/pages/enrollment-review/assigned/assignedIndex";

export const enrollmentReviewRoutes: RouteObject[] = [
  {
    path: "enrollment-review",
    element: <EnrollmentReview />,
    children: [
      {
        index: true,
        element: <Assigned />,
      },
    ],
  },
];
