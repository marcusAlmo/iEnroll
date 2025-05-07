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

const SubNavIndex: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const subNavItems = [
    { label: "Fees", value: "fees" },
    { label: "System Backup", value: "system-backup" },    
  ];

  return (
    <div className="flex flex-col py-4">
      <div className="flex items-center">
        <div className="rounded-[10px] max-h-18 border border-text-2 bg-background p-2">
          <SubNav items={subNavItems} activeItem={activeTab} setActiveItem={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default SubNavIndex;
