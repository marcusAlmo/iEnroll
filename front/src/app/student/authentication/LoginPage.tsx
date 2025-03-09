import { Navigate } from "react-router";
import { useScreenSize } from "../../../contexts/ScreenSizeContext";
import { useState } from "react";

const LoginPage = () => {
  const { mobile } = useScreenSize();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // If screen size not mobile, redirect to Warning Page
  if (!mobile) return <Navigate to="/iEnroll" />;

  // Else display the following TSX
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <h2 className="font-semibold text-accent text-3xl">Announcements</h2>

      <div className="flex justify-center h-40">
        ANNOUNCEMENTS CAROUSEL
      </div>

      <div>
        <h2 className="text-primary font-semibold text-3xl">Uy! Kumusta<span className="text-warning">?</span></h2>
        <p className="text-text-2 font-semibold text-xs text-center py-2">Please log into your account</p>


      </div>
    </div>
  )
}

export default LoginPage
