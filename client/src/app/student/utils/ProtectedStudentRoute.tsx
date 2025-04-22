import { Outlet, Navigate } from "react-router";
import { useScreenSize } from "@/contexts/useScreenSize";
import { useAuth } from "@/contexts/useAuth";

const ProtectedStudentRoute = () => {
  // Get username from context
  const { isAuthenticated, accessToken } = useAuth();

  // Get screen size
  const { mobile } = useScreenSize();

  // If user is authenticated and size is mobile, display
  if (isAuthenticated && accessToken && mobile) return <Outlet />;

  // If user is authenticated but size is NOT mobile, navigate to Warning Page
  if (isAuthenticated && accessToken && !mobile)
    return <Navigate to="/iEnroll" />;

  // Else, navigate to log-in
  return <Navigate to="/log-in" />;
};

export default ProtectedStudentRoute;
