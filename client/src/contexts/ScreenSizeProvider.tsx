import { isMobile } from "../utils/miscUtils";

import { ReactNode } from "react";
import { Navigate } from "react-router";
import { ScreenSizeContext } from "./ScreenSizeContext";

export const ScreenSizeProvider = ({ children }: { children: ReactNode }) => {
  const mobile = isMobile();

  const handleNotMobile = () => {
    if (!mobile) return <Navigate to="/iEnroll" />;
  };

  return (
    <ScreenSizeContext.Provider value={{ mobile, handleNotMobile }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};
