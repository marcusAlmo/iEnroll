import React from "react";
import { useEnrolledStudents } from "../../../../context/enrolledStudentsContext";

/**
 * EnrolledSectionsPanel Component
 *
 * This functional component displays a panel that lists the sections available for the selected grade level.
 * It allows users to select a section, which updates the application state and triggers downstream changes
 * in other panels (e.g., EnrolledStudentsPanel).
 *
 * The component relies on the `useEnrolledStudents` context to manage:
 * - The list of sections for the selected grade level.
 * - The currently selected section.
 * - A function to update the selected section.
 */
export const EnrolledSectionsPanel: React.FC = () => {
  // Destructure required state and functions from the EnrolledStudents context
  const {
    selectedGradeLevel, // ID of the currently selected grade level
    sections, // List of sections for the selected grade level
    selectedSection, // ID of the currently selected section
    setSelectedSection, // Function to update the selected section
    isSectionsPending, // Loading state for sections
  } = useEnrolledStudents();

  return (
    <div className="border-text-2 bg-background h-[530px] w-[210px] overflow-y-scroll border p-3 shadow-md">
      {/* Panel Header */}
      <h3 className="text-text-2 text-left text-sm font-bold">SECTION</h3>

      {/* Section List - Only shown if a grade level is selected */}
      {selectedGradeLevel && (
        <div className="flex w-full flex-row text-sm">
          <ul className="w-full">
            {!isSectionsPending &&
              sections &&
              sections.map((section) => (
                <li
                  key={section.sectionId} // Unique identifier for each section
                  className={`hover:bg-accent/50 w-full cursor-pointer rounded-[20px] px-3 py-1 font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                    selectedSection === section.sectionId ? "bg-accent" : "" // Highlight the selected section
                  }`}
                  onClick={() => setSelectedSection(section.sectionId)} // Update the selected section on click
                >
                  <div>{section.sectionName}</div>{" "}
                  {/* Display the name of the section */}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};
