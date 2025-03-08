import { RouteObject } from "react-router";
import { Home } from "../Home";
import LoginPage from "../student/authentication/LoginPage";
import SignUpPage from "../student/authentication/SignUpPage";

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
  }
]