import React from "react";
import Smiley from "../../../assets/images/Smiley.svg";
import Forms from "../components/CredentialsForm";
import CredentialsIllustration from "@/assets/images/2.svg"
import UppendLogo from "@/assets/images/uppend-logo-white 1.svg";

export default function CredentialsPage() {
  return (
    <div className="bg-primary min-h-screen flex w-screen">
      <img src={CredentialsIllustration} alt="Credentials Illustration" className="absolute left-4/13 transform -translate-x-72 lg:top-9 md:top-9 w-[38rem]"/>
      <div className="flex gap-16 w-full">
        <div className="bg-background w-[60rem] h-[250px] mt-18 rounded-r-xl items-center flex justify-center">
          <div className="flex font-bold text-8xl ">
            <span className="text-accent">i</span>
            <span className="text-primary">Enr</span>
            <img src={Smiley} alt="Smiley" className="mt-2 w-14" />
            <span className="text-primary">ll</span>
          </div>
        </div>
        <div className="flex flex-col md:mr-20">
          <div className="flex justify-center h-[330px] mt-18">
          <Forms />
          </div>
          <p className="mt-4 text-white text-center">
            Don't have an account yet? <span className="text-accent font-semibold">Contact us</span>
          </p>
          <div className="flex flex-col items-center my-32">
            <p className="text-background opacity-50">Designed & Developed by </p>
            <img src={UppendLogo} alt="Uppend Logo" className="w-32" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
