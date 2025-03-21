import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SubNav from "@/app/admin/components/SubNav";

const AssignedIndex: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Assigned");

  const SubNavItem = useMemo(
    () => [
      {
        label: "Assigned",
        onClick: () => {
          setActiveItem("Assigned");
          navigate("admin/enrollment-review");
        },
      },
      {
        label: "Denied",
        onClick: () => {
          setActiveItem("Denied");
          navigate("admin/enrollment-review/denied");
        },
      },
    ],
    [navigate]
  );

  return (
    <div className="flex flex-col px-7 py-7">
      {/* Subnav & Search Bar */}
      <div className="flex justify-between mb-5">
        <div className="rounded-[10px] max-h-18 border border-text-2 bg-background p-2">
          <SubNav items={SubNavItem} activeItem={activeItem} />
        </div>
      </div>
    </div>
  );
};

export default AssignedIndex;
