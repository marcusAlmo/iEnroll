import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import SubNavCopy from "../../../components/SubNavCopy";
import EnrollmentList from "./pages/enrollmentList";

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
    [navigate], // Dependency array ensures SubNavItem updates if `navigate` changes
  );

  return (
    <div className="flex flex-col px-7 py-7">
      {/* Subnav & Search Bar Section */}
      <div className="flex justify-between mb-5 align-middle items-center">
        {/* SubNavCopy Component */}
        <div className="border-text-2 bg-background max-h-18 rounded-[10px] border p-2">
          {/* Renders the sub-navigation bar with navigation items and active state */}
          <SubNavCopy items={SubNavItem} activeItem={activeItem} />
        </div>
        <div className="bg-warning/20 border border-yellow-500 rounded-[10px] px-5 py-1 w-1/2 text-yellow-900"><span className="font-semibold">Note:</span> Currently, you can't reassign multiple students to a different section. We're working on improving this feature!</div>
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
