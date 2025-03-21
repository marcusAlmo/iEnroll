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
          className={`cursor-pointer rounded-[10px] px-6 py-3 transition ease-in-out duration-300 hover:bg-container-2 hover:text-text-2 ${
            activeItem === item.label
              ? "hover hover:text-2 bg-secondary font-semibold text-background transition ease-in-out hover:bg-container-2 hover:text-text-2"
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
