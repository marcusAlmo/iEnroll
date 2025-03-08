import { RouteObject } from "react-router";
import { Home } from "../Home";
import LoginPage from "../student/authentication/LoginPage";
import SignUpPage from "../student/authentication/SignUpPage";
import MeetOurPartners from "../MeetOurPartners";
import WarningPage from "../student/WarningPage";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/log-in",
    element: <LoginPage />
  },
  {
    path: "/sign-up",
    element: <SignUpPage />
  },
  {
    path: "/meet-our-partners",
    element: <MeetOurPartners />
  },
  {
    path: "/iEnroll",
    element: <WarningPage />
  }
]