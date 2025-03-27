import React from "react";

import { GradeLevelsPanel } from "./GradeLevelsPanel";
import { SectionsPanel } from "./SectionsPanel";
import { StudentsPanel } from "./StudentsPanel";
import { RequirementsPanel } from "./RequirementsPanel";
import { RequirementsCarouselModal } from "./RequirementsCarouselModal";

/**
 * EnrollmentList Component
 * 
 * This component displays a multi-panel enrollment management interface that allows users to:
 * - Select grade levels
 * - View sections within a grade level
 * - View students within a section
 * - View and interact with student enrollment requirements
 * 
 * The interface uses a hierarchical selection pattern, where selecting an item in one panel
 * populates the next panel with related data.
 */
const EnrollmentList: React.FC = () => {

  return (
    <div className="w-full flex flex-row">
      {/* 
        Grade Levels Panel
        Displays a scrollable list of all available grade levels
      */}
      <GradeLevelsPanel />

      {/* 
        Sections Panel
        Displays sections available within the selected grade level
      */}
      <SectionsPanel />

      {/* 
        Students Panel
        Displays a table of students in the selected section with application status
      */}
      <StudentsPanel />

      {/* 
        Requirements Panel
        Displays enrollment requirements for the selected student with status indicators
      */}
      <RequirementsPanel />

      {/* 
        Modal Component
        Displays the requirement document image in a modal popup
        Only rendered when isModalOpen is true and a requirement is selected
      */}
      <RequirementsCarouselModal />
    </div>
  );
};

export default EnrollmentList;