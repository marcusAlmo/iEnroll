import { Button } from "@headlessui/react";
import Image from "../../assets/woman-presenting-mobile.png";
import { Navigate, useNavigate } from "react-router";
import { isMobile } from "../../utils/miscUtils";

const WarningPage = () => {
  const navigate = useNavigate();

  // If device is mobile, navigate to 404
  if (isMobile()) return <Navigate to="/not-found" />

  const goToHome = () => {
    navigate("/");
  }

  return (
    <div className="full-screen flex flex-col justify-center items-center gap-y-12">
      <div>
        <img
          src={Image}
          alt="Woman presenting a mobile phone"
          width={500}
          height="auto"
        />
      </div>
      <div className="flex flex-col gap-y-6">
        <h1 className="text-6xl font-bold text-primary text-center">Woah there!</h1>
        <p className="text-3xl text-center text-text-2">Please use a <span className="font-semibold text-text">mobile device</span> to access iEnroll.</p>

        <Button 
          onClick={goToHome}
          className="mt-6 bg-accent rounded-small w-fit text-background font-bold self-center py-4 px-8 text-xl hover:bg-sky-600"
        >
          Go to Home
        </Button>
      </div>
    </div>
  )
}

export default WarningPage
