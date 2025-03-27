import React from 'react'
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext'

export const GradeLevelsPanel:React.FC = () => {

  // Extract all required state and functions from the EnrollmentReview context
    const {
      gradeLevels,              // List of available grade levels
      selectedGradeLevel,       // Currently selected grade level ID
      setSelectedGradeLevel,    // Function to update the selected grade level
    } = useEnrollmentReview();

  return (
     <div className="border-text-2 w-[210px] h-[530px] rounded-[10px] rounded-r border bg-background p-3 shadow-md overflow-y-scroll">
        {/* Panel header */}
        <h3 className="text-left text-sm font-bold text-text-2">GRADE LEVELS</h3>

        {/* Grade levels list */}
        <div className="flex w-full flex-row text-sm">
          <ul className="w-full">
            {gradeLevels.map((level) => (
              <li
                key={level.gradeId}
                className={`w-full cursor-pointer rounded-[20px] py-1 px-3 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/50 ${
                  selectedGradeLevel === level.gradeId ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedGradeLevel(level.gradeId)}
              >
                <div>{level.gradeName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
  )
}
