import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SubNavCopy from "../../../components/SubNavCopy";
import EnrolledList from "./pages/EnrolledList"

const EnrolledIndex:React.FC = () => {

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // State to track the currently active navigation item ("Assigned" or "Denied")
  const [activeItem, setActiveItem] = useState("Enrolled");

  const SubNavItem = useMemo(
    () => [
      {
        label: "Assigned", // Label for the "Assigned" navigation item
        onClick: () => {
          setActiveItem("Assigned"); // Update active state to "Assigned"
          navigate("/admin/enrollment-review"); // Navigate to the "Assigned" route
        },
      },
      {
        label: "Denied", // Label for the "Denied" navigation item
        onClick: () => {
          setActiveItem("Denied"); // Update active state to "Denied"
          navigate("/admin/enrollment-review/denied"); // Navigate to the "Denied" route
        },
      },
      {
        label: "Enrolled", // Label for the "Denied" navigation item
        onClick: () => {
          setActiveItem("Enrolled"); // Update active state to "Denied"
          navigate("/admin/enrollment-review/enrolled"); // Navigate to the "Denied" route
        },
      },
    ],
    [navigate] // Dependency array ensures SubNavItem updates if `navigate` changes
  );

  return (
    <div className="flex flex-col px-7 py-7">
      {/* Subnav & Search Bar Section */}
      <div className="flex justify-between mb-5">
        {/* SubNavCopy Component */}
        <div className="rounded-[10px] max-h-18 border border-text-2 bg-background p-2">
          {/* Renders the sub-navigation bar with navigation items and active state */}
          <SubNavCopy items={SubNavItem} activeItem={activeItem} />
        </div>
      </div>
      {/* Enrollment List Section */}
      <div>
        {/* Displays the list of enrollments based on the active navigation item */}
        <EnrolledList />
      </div>
    </div>
  )
}

export default EnrolledIndex;