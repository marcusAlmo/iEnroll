import React from "react";
import { EnrolledStudentsContext } from "./EnrolledStudentsContext.1";

/**
 * Custom hook to use the EnrolledStudents context
 *
 * This hook provides a convenient way to access the context in components
 * and includes error handling to ensure it's used correctly.
 *
 * @returns The EnrolledStudents context value
 * @throws Error if used outside of EnrolledStudentsProvider
 */

export function useEnrolledStudents() {
  const context = React.useContext(EnrolledStudentsContext);
  if (!context) {
    throw new Error(
      "useEnrolledStudents must be used within an EnrolledStudentsProvider",
    );
  }
  return context;
}
