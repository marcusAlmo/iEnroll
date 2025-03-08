import { useRoutes } from "react-router";
import { routes } from "./routes";

export default function AppRouter() {
  return useRoutes(routes);
}