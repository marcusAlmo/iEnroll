import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SubNavCopy from "../../../components/SubNavCopy";
import EnrollmentList from "./components/enrollmentList";

/**
 * AssignedIndex Component
 * 
 * This component serves as the main container for managing enrollment reviews.
 * It provides navigation options between "Assigned" and "Denied" states 
 * and displays a list of enrollments based on the selected state.
 */
const AssignedIndex: React.FC = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // State to track the currently active navigation item ("Assigned" or "Denied")
  const [activeItem, setActiveItem] = useState("Assigned");

  /**
   * useMemo Hook for SubNav Items
   * 
   * This memoized array defines the navigation items for the sub-navigation bar.
   * Each item includes a label and an onClick handler to update the active state
   * and navigate to the corresponding route.
   */
  const SubNavItem = useMemo(
    () => [
      {
        label: "Assigned", // Label for the "Assigned" navigation item
        onClick: () => {
          setActiveItem("Assigned"); // Update active state to "Assigned"
          navigate("admin/enrollment-review"); // Navigate to the "Assigned" route
        },
      },
      {
        label: "Denied", // Label for the "Denied" navigation item
        onClick: () => {
          setActiveItem("Denied"); // Update active state to "Denied"
          navigate("denied"); // Navigate to the "Denied" route
        },
      },
      {
        label: "Enrolled", // Label for the "Denied" navigation item
        onClick: () => {
          setActiveItem("Enrolled"); // Update active state to "Denied"
          navigate("enrolled"); // Navigate to the "Denied" route
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
        <EnrollmentList />
      </div>
    </div>
  );
};

// Export the AssignedIndex component as the default export
export default AssignedIndex;