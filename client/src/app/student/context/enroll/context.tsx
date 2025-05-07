import { createContext } from "react";
import { EnrollContextProps } from "./provider";

export const EnrollContext = createContext<
  EnrollContextProps | undefined
>(undefined);
