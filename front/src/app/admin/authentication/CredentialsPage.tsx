import React from "react";
import Smiley from "../../../assets/images/Smiley.svg";
import Forms from "../components/CredentialsForm";

export default function CredentialsPage() {
  return (
    <div className="bg-primary min-h-screen flex justify-center">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="bg-background w-[320px] h-[100px] rounded-normal items-center flex justify-center">
          <div className="flex font-bold text-4xl">
            <span className="text-accent">i</span>
            <span className="text-primary">Enr</span>
            <img src={Smiley} alt="Smiley" className="mt-2" />
            <span className="text-primary">ll</span>
          </div>
        </div>
        <Forms />
        <div className="flex gap-1 text-[16px] font-[400]">
          <p className="text-white">Don't have an account yet?</p>
          <button className="text-accent">Contact us</button>
        </div>
      </div>
    </div>
  );
}
