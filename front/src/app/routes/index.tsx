import { RouteObject } from "react-router";
import { publicRoutes } from "./publicRoutes";
import NotFound from "./NotFound";
import { protectedRoutes } from "./protectedRoutes";

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: "*", element: <NotFound />
  }
];