import { createContext } from "react";
import { ScreenSizeContextProps } from "./types";

export const ScreenSizeContext = createContext<ScreenSizeContextProps>({
  mobile: false,
  handleNotMobile: () => {},
});
