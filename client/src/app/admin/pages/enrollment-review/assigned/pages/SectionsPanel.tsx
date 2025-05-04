import React from "react";
import { useEnrollmentReview } from "@/app/admin/context/useEnrollmentReview";

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
  const {
    selectedGradeLevel, // ID of the currently selected grade level
    sections, // List of sections for the selected grade level
    selectedSection, // ID of the currently selected section
    setSelectedSection, // Function to update the selected section
    isSectionsPending, // Loading state for sections
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 bg-background h-[530px] w-[210px] overflow-y-scroll rounded-[10px] rounded-r border p-3 shadow-md">
      {/* Panel Header */}
      <h3 className="text-text-2 text-left text-sm font-bold">SECTION</h3>

      {/* If grade level is selected, handle loading and empty states */}
      {selectedGradeLevel &&
        (isSectionsPending ? (
          <div className="text-text-2 flex h-full items-center justify-center text-sm">
            Loading sections...
          </div>
        ) : sections?.length === 0 ? (
          <div className="text-text-2 flex h-full items-center justify-center text-sm">
            No sections available.
          </div>
        ) : (
          <div className="flex w-full flex-row text-sm">
            <ul className="w-full">
              {sections?.map((section) => (
                <li
                  key={section.sectionId}
                  className={`hover:bg-accent/50 w-full cursor-pointer rounded-[20px] px-3 py-1 font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                    selectedSection?.sectionId === section.sectionId
                      ? "bg-accent"
                      : ""
                  }`}
                  onClick={() => setSelectedSection(section)}
                >
                  <div>{section.sectionName}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};
