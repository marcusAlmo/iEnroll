import { createContext, useContext } from "react";
import { isMobile } from "../utils/miscUtils";

interface ScreenSizeContextProps {
  mobile: boolean;
  handleNotMobile: () => void;
}

const ScreenSizeContext = createContext<ScreenSizeContextProps>({
  mobile: false,
  handleNotMobile: () => {},
});

import { ReactNode } from "react";
import { Navigate } from "react-router";

export const ScreenSizeProvider = ({ children }: { children: ReactNode }) => {
  const mobile = isMobile();

  const handleNotMobile = () => {
    if (!mobile) return <Navigate to="/iEnroll" />
  }

  return (
    <ScreenSizeContext.Provider value={{ mobile, handleNotMobile }}>
      { children }
    </ScreenSizeContext.Provider>
  )
};

export const useScreenSize = (): ScreenSizeContextProps => {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};