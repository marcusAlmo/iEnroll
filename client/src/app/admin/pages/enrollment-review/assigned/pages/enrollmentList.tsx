import React from "react";

import { GradeLevelsPanel } from "./GradeLevelsPanel";
import { SectionsPanel } from "./SectionsPanel";
import { StudentsPanel } from "./StudentsPanel";
import { RequirementsPanel } from "./RequirementsPanel";
import { RequirementsCarouselModal } from "../components/RequirementsCarouselModal";
import ReassignSectionModal from "../components/ReassignSectionModal";
import AssignSectionModal from "../components/AssignSectionModal";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";

/**
 * EnrollmentList Component
 * 
 * This component serves as the main interface for managing student enrollments.
 * It provides a hierarchical selection pattern where users can:
 * 1. Select a grade level from the `GradeLevelsPanel`.
 * 2. View sections within the selected grade level in the `SectionsPanel`.
 * 3. View students within the selected section in the `StudentsPanel`.
 * 4. View and interact with enrollment requirements for a selected student in the `RequirementsPanel`.
 * 
 * Additionally, the `RequirementsCarouselModal` allows users to view detailed requirement documents
 * in a modal popup when a specific requirement is selected.
 * 
 * The component assumes that data is passed down or managed via context or a parent state manager.
 */
const EnrollmentList: React.FC = () => {
  // Get the section modal type from the context
  const { sectionModalType } = useEnrollmentReview();
  
  return (
    <div className="w-full flex flex-row">
      {/* 
        Grade Levels Panel
        Displays a scrollable list of all available grade levels.
        - Users can select a grade level to populate the `SectionsPanel`.
        - Assumed to fetch or receive grade levels dynamically.
      */}
      <GradeLevelsPanel />

      {/* 
        Sections Panel
        Displays sections available within the selected grade level.
        - Populated based on the grade level selected in the `GradeLevelsPanel`.
        - Users can select a section to populate the `StudentsPanel`.
      */}
      <SectionsPanel />

      {/* 
        Students Panel
        Displays a table of students in the selected section, including their application status.
        - Populated based on the section selected in the `SectionsPanel`.
        - Users can select a student to populate the `RequirementsPanel`.
      */}
      <StudentsPanel />

      {/* 
        Requirements Panel
        Displays enrollment requirements for the selected student, along with status indicators.
        - Populated based on the student selected in the `StudentsPanel`.
        - Users can interact with individual requirements to view detailed documents.
      */}
      <RequirementsPanel />

      {/* 
        Requirements Carousel Modal
        Displays a detailed view of the selected requirement document in a modal popup.
        - Only rendered when a requirement is selected and the modal is open.
        - Controlled by internal state or props (e.g., `isModalOpen`).
      */}
      <RequirementsCarouselModal />
      
      {/* 
        Section Modals
        Conditionally render either the AssignSectionModal or ReassignSectionModal
        based on the sectionModalType state from the context.
      */}
      {sectionModalType === 'assign' ? <AssignSectionModal /> : <ReassignSectionModal />}
    </div>
  );
};

// Export the EnrollmentList component as the default export
export default EnrollmentList;