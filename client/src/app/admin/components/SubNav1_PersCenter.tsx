import React, { useState } from "react";

interface SubNavItem {
  label: string;
  value: string;
}

interface SubNavProps {
  items: SubNavItem[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ items, activeItem, setActiveItem }) => {
  return (
    <nav className="flex gap-x-1 items-center justify-center text-center">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => setActiveItem(item.value)}
          className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
            activeItem === item.value
              ? "bg-accent font-semibold text-background transition ease-in-out hover:bg-primary hover:text-background"
              : "bg-background text-text-2"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

const SubNav1_PersCenter: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const subNavItems = [
    { label: "Roles & Access", value: "roles-access" },
    { label: "History & Logs", value: "history-logs" },
  
  ];


  return (
    <div className="rounded-[8px] max-h-18  max-w-2xs border border-text-2 bg-background p-2 mx-1 text-sm ">
        <SubNav items={subNavItems} activeItem={activeTab} setActiveItem={setActiveTab} />
    </div>
  );
};

export default SubNav1_PersCenter;
