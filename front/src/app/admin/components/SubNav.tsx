// SubNav.tsx
import React from "react";

interface SubNavItem {
  label: string;
  onClick: () => void;
}

interface SubNavProps {
  items: SubNavItem[];
  activeItem: string;
}

const SubNav: React.FC<SubNavProps> = ({ items, activeItem }) => {
  return (
    <div className="flex gap-x-1 items-center justify-center text-center">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`cursor-pointer rounded-[10px] px-4 py-2 transition ease-in-out duration-300 hover:bg-accent hover:text-background ${
            activeItem === item.label
              ? "bg-accent font-semibold text-background transition ease-in-out hover:bg-primary hover:text-background"
              : "bg-background text-text-2"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SubNav;
