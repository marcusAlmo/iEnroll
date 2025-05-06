import React from "react";
import { EnrollContext } from "./context";

export const useEnroll = () => {
  const context = React.useContext(EnrollContext);
  if (!context) {
    throw new Error("useEnroll must be used within an EnrollProvider");
  }
  return context;
};
