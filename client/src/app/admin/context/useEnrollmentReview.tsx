import React from "react";
import { EnrollmentReviewContext } from "./EnrollmentReviewContext.1";

/**
 * Custom hook to use the EnrollmentReview context
 *
 * This hook provides a convenient way to access the context in components
 * and includes error handling to ensure it's used correctly.
 *
 * @returns The EnrollmentReview context value
 * @throws Error if used outside of EnrollmentReviewProvider
 */

export const useEnrollmentReview = () => {
  const context = React.useContext(EnrollmentReviewContext);
  if (!context) {
    throw new Error(
      "useEnrollmentReview must be used within an EnrollmentReviewProvider",
    );
  }
  return context;
};
