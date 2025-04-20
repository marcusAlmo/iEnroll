import { useContext } from "react";
import { ScreenSizeContext } from "./ScreenSizeContext";
import { ScreenSizeContextProps } from "./types";

export const useScreenSize = (): ScreenSizeContextProps => {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
