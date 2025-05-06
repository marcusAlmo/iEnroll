import { useScreenSize } from "@/contexts/useScreenSize";
import { Navigate, Outlet } from "react-router";
import { EnrollProvider } from "../context/enroll/provider";

const EnrollmentRoute = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/i-Enroll" />;

  return (
    <EnrollProvider>
      <Outlet />
    </EnrollProvider>
  );
};

export default EnrollmentRoute;
