import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubNav = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [activeTab, setActive] = useState("Enrollment Breakdown");
  const navigate = useNavigate();

  const navItems = [
    { to: "enrollment-breakdown", label: "Enrollment Breakdown" },
    { to: "enrollment-trend", label: "Enrollment Trend" },
    { to: "enrollment-count", label: "Enrollment Count" },
    { to: "plan-capacity", label: "Plan Capacity" },
  ];  

  const handleTabClick = (label: string, to: string) => {
    setActive(label);
    setActiveTab(label);
    navigate(to, { relative: "path" }); 
  };

  return (
    <div className="py-2 border-2 border-text-2 rounded-lg flex items-center justify-center mx-auto my-4 w-fit text-sm">
      {navItems.map(({ to, label }) => (
        <button
          key={label}
          onClick={() => handleTabClick(label, to)}
          className={`py-2 px-4 mx-3 rounded-lg font-semibold font-inter transition duration-300 ${
            activeTab === label
              ? "bg-accent text-background"
              : "bg-background text-primary hover:bg-accent hover:text-background"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SubNav;