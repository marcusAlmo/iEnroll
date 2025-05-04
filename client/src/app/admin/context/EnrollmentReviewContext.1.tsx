import { createContext } from "react";
import { EnrollmentReviewContextProps } from "./enrollmentReviewContext";

// Create the context with undefined default value

export const EnrollmentReviewContext = createContext<
  EnrollmentReviewContextProps | undefined
>(undefined);
