import React from 'react';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

/**
 * RequirementsPanel Component
 *
 * This functional component displays a panel that lists the requirements for a selected student.
 * It provides a table view of the requirements, their statuses (approved, rejected, or pending),
 * and an action button to view additional details if available.
 */
export const RequirementsPanel: React.FC = () => {
  // Destructure context values from the enrollment review context
  const {
    
    // currentIndex,             // Tracks the currently selected requirement index
    setCurrentIndex,          // Function to update the current index
    selectedStudent,          // The currently selected student object
    requirements,             // List of requirements for the selected student
    setSelectedRequirement,   // Function to set the currently selected requirement
    setIsModalOpen,           // Function to toggle the visibility of the modal
  } = useEnrollmentReview();

  return (
    // Main container for the requirements panel
    <div className="border-text-2 bg-background h-[530px] w-[460px] overflow-y-scroll rounded-[10px] rounded-l border p-2 shadow-md">
      {/* Table to display the list of requirements */}
      <table className="w-full table-auto border-collapse">
        {/* Table header */}
        <thead className="text-text-2 text-left">
          <tr>
            <th>REQUIREMENTS</th> {/* Column for requirement names */}
            <th>STATUS</th>      {/* Column for requirement statuses */}
            <th>ACTION</th>      {/* Column for actions (e.g., "View") */}
          </tr>
        </thead>

        {/* Table body containing the list of requirements */}
        <tbody className="w-full text-left text-sm">
          {/* Render rows only if a student is selected */}
          {selectedStudent &&
            requirements.map((requirement, index) => (
              <tr key={index} className="hover:bg-accent/50">
                {/* Requirement name */}
                <td className="w-2/4 border-b p-1">
                  {requirement.requirementName}
                </td>

                {/* Requirement status - displayed as check/x icons */}
                <td className="w-1/4 border-b py-1">
                  <span
                    className="cursor-pointer items-center justify-center rounded text-start align-middle font-semibold transition-all duration-300 ease-in-out"
                  >
                    {/* Conditional rendering of status icons based on requirement status */}
                    {requirement.requirementStatus === true ? (
                      <>
                        {/* Green check for approved requirements */}
                        {/* <FontAwesomeIcon icon={faSquareCheck} className="text-success mr-2" /> */}
                        {/* Gray X for the inactive state */}
                        {/* <FontAwesomeIcon icon={faSquareXmark} className="text-gray-400" /> */}
                        <p className='my-2 mr-2 rounded-full border border-green-700 bg-success/20 py-1 text-center text-xs text-green-700'>Approved</p>
                      </>
                    ) : requirement.requirementStatus === false ? (
                      <>
                        {/* Gray check for the inactive state */}
                        {/* <FontAwesomeIcon icon={faSquareCheck} className="text-gray-400 mr-2" /> */}
                        {/* Red X for rejected requirements */}
                        {/* <FontAwesomeIcon icon={faSquareXmark} className="text-danger" /> */}
                        <p className='my-2 mr-2 rounded-full border border-red-700 bg-danger/20 py-1 text-center text-xs text-red-700'>Denied</p>
                      </>
                    ) : (
                      <>
                        {/* Gray icons for undefined (pending) status */}
                        {/* <FontAwesomeIcon icon={faSquareCheck} className="text-gray-400 mr-2" />
                        <FontAwesomeIcon icon={faSquareXmark} className="text-gray-400" /> */}
                        <p className='my-2 mr-2 rounded-full border border-yellow-900 bg-warning/20 py-1 text-center text-xs text-yellow-900'>For Review</p>
                      </>
                    )}
                  </span>
                </td>

                {/* Action column - provides a button to view details if available */}
                <td className="w-1/4 border-b p-1">
                  {(requirement.imageUrl || requirement.userInput) && (
                    <button
                      className="cursor-pointer font-semibold text-accent underline transition-all duration-300 ease-in-out hover:scale-110 hover:text-primary ml-3"
                      onClick={() => {
                        // Find the index of the current requirement in the requirements array
                        const index = requirements.findIndex(
                          (req) =>
                            req.requirementName === requirement.requirementName,
                        );
                        // Update the current index and selected requirement before opening the modal
                        setCurrentIndex(index);
                        setSelectedRequirement(requirement);
                        setIsModalOpen(true); // Open the modal
                      }}
                    >
                    view
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
