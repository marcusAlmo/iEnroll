import React from "react";
import { Link } from "react-router";
import Smiley from "../../../assets/images/Smiley.svg";

const MainNav: React.FC = () => {
  return (
    <nav className="bg-background shadow-md py-2 px-6 flex justify-between items-center fixed top-0 w-full z-50">
      <div className="flex items-center font-bold text-2xl">
        <span className="text-accent">i</span>
        <span className="text-primary">Enr</span>
        <img className="w-4 h-5 mt-1" src={Smiley} alt="Smiley"/>
        <span className="text-primary">ll</span>
      </div>
      <Link className="button-transition rounded-[5px] bg-accent px-4 py-1 text-white hover:scale-105 hover:bg-primary" to={"/admin-credentials"}>
        Log In
      </Link>
    </nav>
  );
};

export default MainNav;