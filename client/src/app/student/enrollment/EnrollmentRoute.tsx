import { useScreenSize } from "@/contexts/useScreenSize"
import { Navigate, Outlet } from "react-router"

const EnrollmentRoute = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/i-Enroll" />

  return <Outlet />
}

export default EnrollmentRoute
