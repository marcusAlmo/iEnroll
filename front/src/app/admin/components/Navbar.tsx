import React from "react";
import { Link, useLocation } from "react-router-dom";
import Settings from "../../../assets/images/Settings.svg";
import Smiley from "../../../assets/images/Smiley.svg";

const Navbar: React.FC = () => {
  const location = useLocation(); 
  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/enrollment-review", label: "Enrollment Review" },
    { to: "/admin/enrollment-management", label: "Enrollment Management" },
    { to: "/admin/personnel-", label: "Personnel Center" },
  ];

  return (
    <nav className="bg-white shadow-md py-3 px-8 flex justify-between items-center fixed top-0 w-full z-50 font-inter">
      <div className="flex items-center font-bold text-2xl">
        <span className="text-accent">i</span>
        <span className="text-primary">Enr</span>
        <img className="w-4 h-5 mt-1" alt="Smiley" src={Smiley} />
        <span className="text-primary">ll</span>
      </div>

      <div className="flex space-x-6 text-md">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`py-2 px-4 font-semibold transition duration-300 
              ${
                location.pathname === item.to
                  ? "bg-container_1 text-primary"
                  : "text-primary hover:bg-gray-200"
              }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <button className="p-2 hover:bg-gray-200 rounded-md transition duration-300">
        <img className="w-6 h-6" src={Settings} alt="settings" />
      </button>
    </nav>
  );
};

export default Navbar;