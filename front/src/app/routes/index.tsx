import { RouteObject } from "react-router";
import { publicRoutes } from "./publicRoutes";
import NotFound from "./NotFound";

export const routes: RouteObject[] = [
  ...publicRoutes,
  {
    path: "*", element: <NotFound />
  }
];