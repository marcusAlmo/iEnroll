import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";

/**
 * GradeLevelsPanel Component
 *
 * This component displays a list of grade levels for enrollment management.
 * It allows users to select a grade level, which updates the application state
 * and triggers downstream changes in other panels (e.g., SectionsPanel).
 *
 * The component relies on the `useEnrollmentReview` context to manage:
 * - The list of available grade levels.
 * - The currently selected grade level.
 * - A function to update the selected grade level.
 */
export const GradeLevelsPanel: React.FC = () => {
  // Extract all required state and functions from the EnrollmentReview context
  const {
    gradeLevels, // List of available grade levels
    selectedGradeLevel, // ID of the currently selected grade level
    setSelectedGradeLevel, // Function to update the selected grade level
    isGradeLevelPending, // Loading state for grade levels
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 bg-background h-[530px] w-[210px] overflow-y-scroll rounded-[10px] rounded-r border p-3 shadow-md">
      {/* Panel Header */}
      <h3 className="text-text-2 text-left text-sm font-bold">GRADE LEVELS</h3>

      {/* Loading State */}
      {isGradeLevelPending ? (
        <div className="text-text-2 flex h-full items-center justify-center text-sm">
          Loading grade levels...
        </div>
      ) : gradeLevels?.length === 0 ? (
        /* Empty State */
        <div className="text-text-2 flex h-full items-center justify-center text-sm">
          No grade levels available.
        </div>
      ) : (
        /* Grade Levels List */
        <div className="flex w-full flex-row text-sm">
          <ul className="w-full">
            {gradeLevels?.map((level) => (
              <li
                key={level.gradeId} // Unique identifier for each grade level
                className={`hover:bg-accent/50 w-full cursor-pointer rounded-[20px] px-3 py-1 font-semibold transition-all duration-300 ease-in-out hover:scale-105 ${
                  selectedGradeLevel === level.gradeId ? "bg-accent" : "" // Highlight the selected grade level
                }`}
                onClick={() => setSelectedGradeLevel(level.gradeId)} // Update the selected grade level on click
              >
                <div>{level.gradeName}</div>{" "}
                {/* Display the name of the grade level */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
