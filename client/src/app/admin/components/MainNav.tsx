import React from "react";
import { Link } from "react-router";
import Smiley from "../../../assets/images/Smiley.svg";

const MainNav: React.FC = () => {
  return (
    <nav className="bg-white shadow-md py-2 px-6 flex justify-between items-center fixed top-0 w-full z-50">
      <div className="flex items-center font-bold text-2xl">
        <span className="text-accent">i</span>
        <span className="text-primary">Enr</span>
        <img className="w-4 h-5 mt-1" src={Smiley} alt="Smiley"/>
        <span className="text-primary">ll</span>
      </div>
      <Link className="bg-accent text-white px-4 py-1 rounded-lg shadow-lg hover:bg-blue-500 transition" to={"/admin-credentials"}>
        Log In
      </Link>
    </nav>
  );
};

export default MainNav;