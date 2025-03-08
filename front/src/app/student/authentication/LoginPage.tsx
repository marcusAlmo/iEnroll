import { Navigate } from "react-router";
import { useScreenSize } from "../../../contexts/ScreenSizeContext";

const LoginPage = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/iEnroll" />;

  return (
    <div>
      Log in Page
    </div>
  )
}

export default LoginPage
