import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router";
import SettingsIcon from "@/assets/images/Settings.svg";
import SmileyIcon from "@/assets/images/Smiley.svg";
import { ToastContainer } from "react-toastify";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const navItems = useMemo(
    () => [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Enrollment Review", to: "/admin/enrollment-review" },
      { label: "Enrollment Management", to: "/admin/enrollment-management" },
      { label: "Personnel Center", to: "/admin/personnel-center" },
    ],
    []
  );


  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  return (
    <nav className="bg-white shadow-md py-3 px-8 flex justify-between items-center w-full font-inter sticky top-0 z-50">

      {/* Logo Section */}
      <div className="flex items-center font-bold text-2xl">
        <span className="text-accent">i</span>
        <span className="text-primary">Enr</span>
        <img className="w-4 h-5 mt-1" alt="Smiley" src={SmileyIcon} />
        <span className="text-primary">ll</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-x-8 text-md">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`font-semibold transition duration-300 px-3 py-2 rounded-md 
              ${activeItem === item.to ? "bg-primary text-white" : "text-primary hover:bg-gray-200"}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Settings Button */}
      <button className="p-2 hover:bg-gray-200 rounded-md transition duration-300">
        <img className="w-6 h-6" src={SettingsIcon} alt="settings" />
      </button>
    </nav>
  );
};

export default Navbar;
