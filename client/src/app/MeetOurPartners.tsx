import { Navigate, useNavigate } from "react-router";
import { useScreenSize } from "@/contexts/useScreenSize";
import Image from "../assets/school.png";

// Test data
import schools from "../test/data/partner-schools.json";
import { Button } from "@headlessui/react";

const MeetOurPartners = () => {
  const { mobile } = useScreenSize();
  const navigate = useNavigate();

  if (!mobile) return <Navigate to="/iEnroll" />;

  const goToLogin = () => {
    navigate("/log-in");
  };

  // If mobile, display the following JSX
  return (
    <div className="my-8 flex flex-col items-center gap-y-4">
      <img src={Image} alt="School facade" width={250} />
      <h2 className="text-accent mb-4 w-[80%] text-center text-2xl font-semibold">
        Meet our beloved school partners
      </h2>

      <div className="flex justify-center">
        <ul className="text-text-2 list-inside list-disc text-sm">
          {schools.map((school) => (
            <li key={school.id}>{school.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button
          onClick={goToLogin}
          className="bg-accent rounded-small text-background w-fit self-center px-10 py-2 text-base font-bold hover:bg-sky-600"
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default MeetOurPartners;
