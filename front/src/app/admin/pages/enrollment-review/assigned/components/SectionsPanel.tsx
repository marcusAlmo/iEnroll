import React from 'react'
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext'

export const SectionsPanel:React.FC = () => {

  const {
    selectedGradeLevel,       // Currently selected 
    sections,                 // List of sections for the selected grade level
    selectedSection,          // Currently selected 
    setSelectedSection,       // Function to update the 
  } = useEnrollmentReview();
  return (
    <div className="border-text-2 w-[210px] h-[530px] border bg-background p-3 shadow-md overflow-y-scroll">
        {/* Panel header */}
        <h3 className="text-left text-sm font-bold text-text-2">SECTION</h3>

        {/* Section list - only shown if a grade level is selected */}
        {selectedGradeLevel && (
          <div className="flex w-full flex-row text-sm">
            <ul className="w-full">
              {sections.map((section) => (
                <li
                  key={section.sectionId}
                  className={`w-full cursor-pointer rounded-[20px] py-1 px-3 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-accent/50 ${
                    selectedSection === section.sectionId ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedSection(section.sectionId)}
                >
                  <div>{section.sectionName}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
  )
}
