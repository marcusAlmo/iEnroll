import { Navigate } from "react-router";
import { useScreenSize } from "../../../contexts/ScreenSizeContext";

const SignUpPage = () => {
  const { mobile } = useScreenSize();

  if (!mobile) return <Navigate to="/iEnroll" />;

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="flex flex-col items-center gap-y-8">
        <h2 className="text-accent text-3xl font-semibold">Uy! Ka-iEnroll?</h2>
        <p className="text-text-2 font-semibold text-xs">Please fill the form to create an account.</p>
      </div>
    </div>
  )
}

export default SignUpPage
