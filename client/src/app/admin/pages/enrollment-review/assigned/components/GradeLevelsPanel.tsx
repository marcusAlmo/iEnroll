import React from 'react';
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

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
    gradeLevels,              // List of available grade levels
    selectedGradeLevel,       // ID of the currently selected grade level
    setSelectedGradeLevel,    // Function to update the selected grade level
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 w-[210px] h-[530px] rounded-[10px] rounded-r border bg-background p-3 shadow-md overflow-y-scroll">
      {/* Panel Header */}
      <h3 className="text-left text-sm font-bold text-text-2">GRADE LEVELS</h3>

      {/* Grade Levels List */}
      <div className="flex w-full flex-row text-sm">
        <ul className="w-full">
          {gradeLevels.map((level) => (
            <li
              key={level.gradeId} // Unique identifier for each grade level
              className={`w-full cursor-pointer rounded-[20px] py-1 px-3 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/50 ${
                selectedGradeLevel === level.gradeId ? "bg-accent" : "" // Highlight the selected grade level
              }`}
              onClick={() => setSelectedGradeLevel(level.gradeId)} // Update the selected grade level on click
            >
              <div>{level.gradeName}</div> {/* Display the name of the grade level */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};