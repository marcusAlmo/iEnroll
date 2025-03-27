import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

export const RequirementsPanel:React.FC = () => {
    const {
      selectedStudent,          // Currently selected student object
      requirements,             // List of requirements for the selected student
      setSelectedRequirement,   // Function to update the selected requirement
      setIsModalOpen,           // Function to toggle modal visibility
    } = useEnrollmentReview();

  return (
    <div className="border-text-2 w-[460px] h-[530px] border bg-background p-2 shadow-md overflow-y-scroll rounded-l rounded-[10px]">
      <table className="table-auto w-full border-collapse">
        {/* Table header */}
        <thead className="text-text-2 text-left">
          <tr>
            <th className="">REQUIREMENT</th>
            <th className="">STATUS</th>
            <th className="">ACTION</th>
          </tr>
        </thead>
        <tbody className="w-full text-left text-sm">
          {/* Requirements rows - only shown if a student is selected */}
          {selectedStudent &&
            requirements.map((requirement, index) => (
              <tr key={index} className="hover:bg-accent/50">
                {/* Requirement name */}
                <td className="w-2/4 border-b p-1">{requirement.requirementName}</td>
                
                {/* Requirement status - displayed as check/x icons */}
                <td className="w-1/4 border-b py-1">
                  <span
                    className="cursor-pointer rounded px-2 py-1 text-xl font-semibold transition-all duration-300 ease-in-out"
                  >
                    {/* Conditional rendering of status icons based on requirement status */}
                    {requirement.requirementStatus === true ? (
                      <>
                        {/* Green check for approved requirements */}
                        <FontAwesomeIcon icon={faSquareCheck} className="text-success" />
                        {/* Gray X for the inactive state */}
                        <FontAwesomeIcon icon={faSquareXmark} className="text-gray-400 mx-2" />
                      </>
                    ) : requirement.requirementStatus === false ? (
                      <>
                        {/* Gray check for the inactive state */}
                        <FontAwesomeIcon icon={faSquareCheck} className="text-gray-400 mx-2" />
                        {/* Red X for rejected requirements */}
                        <FontAwesomeIcon icon={faSquareXmark} className="text-danger" />
                      </>
                    ) : (
                      <>
                        {/* Gray icons for undefined status */}
                        <FontAwesomeIcon icon={faSquareCheck} className="text-gray-400 mr-2" />
                        <FontAwesomeIcon icon={faSquareXmark} className="text-gray-400" />
                      </>
                    )}
                  </span>
                </td>
                
                {/* View action - only visible if requirement has an imageUrl */}
                <td className="w-1/4 border-b p-1">
                  {(requirement.imageUrl || requirement.userInput) && (
                  <button
                    className="text-accent underline font-semibold cursor-pointer hover:scale-110 transition-all ease-in-out duration-300 hover:text-primary"
                    onClick={() => {
                    setSelectedRequirement(requirement);
                    setIsModalOpen(true);
                    }}
                  >
                    View
                  </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
