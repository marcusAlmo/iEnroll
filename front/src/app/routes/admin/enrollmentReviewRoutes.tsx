import { RouteObject } from "react-router";
import EnrollmentReview from "../../admin/pages/enrollment-review/EnrollmentReview";

export const enrollmentReviewRoutes: RouteObject[] = [
  {
    path: "enrollment-review",
    element: <EnrollmentReview />,
  },
];
