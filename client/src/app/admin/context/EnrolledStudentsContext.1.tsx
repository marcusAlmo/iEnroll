import { createContext } from "react";
import { EnrolledStudentsContextProps } from "./enrolledStudentsContext";

// Create the context with undefined default value

export const EnrolledStudentsContext = createContext<
  EnrolledStudentsContextProps | undefined
>(undefined);
