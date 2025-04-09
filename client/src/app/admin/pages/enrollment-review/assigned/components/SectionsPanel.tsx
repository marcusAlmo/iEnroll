import React from 'react';
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

/**
 * SectionsPanel Component
 * 
 * This functional component displays a panel that lists the sections available for the selected grade level.
 * It allows users to select a section, which updates the application state and triggers downstream changes
 * in other panels (e.g., StudentsPanel).
 * 
 * The component relies on the `useEnrollmentReview` context to manage:
 * - The list of sections for the selected grade level.
 * - The currently selected section.
 * - A function to update the selected section.
 */
export const SectionsPanel: React.FC = () => {
  // Destructure required state and functions from the EnrollmentReview context
  const {
    selectedGradeLevel,       // ID of the currently selected grade level
    sections,                 // List of sections for the selected grade level
    selectedSection,          // ID of the currently selected section
    setSelectedSection,       // Function to update the selected section
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 w-[210px] h-[530px] border bg-background p-3 shadow-md overflow-y-scroll">
      {/* Panel Header */}
      <h3 className="text-left text-sm font-bold text-text-2">SECTION</h3>

      {/* Section List - Only shown if a grade level is selected */}
      {selectedGradeLevel && (
        <div className="flex w-full flex-row text-sm">
          <ul className="w-full">
            {sections.map((section) => (
              <li
                key={section.sectionId} // Unique identifier for each section
                className={`w-full cursor-pointer rounded-[20px] py-1 px-3 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/50 ${
                  selectedSection === section.sectionId ? "bg-accent" : "" // Highlight the selected section
                }`}
                onClick={() => setSelectedSection(section.sectionId)} // Update the selected section on click
              >
                <div>{section.sectionName}</div> {/* Display the name of the section */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};