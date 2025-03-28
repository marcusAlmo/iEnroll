import React from 'react';
import { Input } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCheckSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

/**
 * RequirementsCarouselModal Component
 * 
 * This modal displays a detailed view of a selected requirement, allowing users to:
 * - Navigate between requirements using left/right arrows.
 * - Approve or deny a requirement.
 * - Provide a reason for denial if the requirement is denied.
 * 
 * The modal is conditionally rendered based on the `isModalOpen` state and the presence of requirements.
 */
export const RequirementsCarouselModal: React.FC = () => {
  // Extract required state and functions from the EnrollmentReview context
  const {
    selectedRequirement,       // The currently selected requirement
    requirements,              // List of all requirements
    handleNext,                // Function to navigate to the next requirement
    handlePrevious,            // Function to navigate to the previous requirement
    handleRequirementStatus,   // Function to update the status (approved/denied) of a requirement
    isModalOpen,               // Boolean indicating whether the modal is open
    setIsModalOpen,            // Function to toggle the modal's visibility
    isDenied,                  // Boolean indicating whether the requirement is denied
    setIsDenied,               // Function to toggle the denial state
  } = useEnrollmentReview();

  // If the modal is not open, there are no requirements, or no requirement is selected, return null
  if (!isModalOpen || !requirements.length || !selectedRequirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Exit Button */}
      <div className="flex justify-end">
        <button
          className="absolute top-2 right-2 cursor-pointer rounded-[10px] bg-danger px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-red-950 hover:scale-115"
          onClick={() => setIsModalOpen(false)} // Close the modal when clicked
        >
          Exit
        </button>
      </div>

      {/* Carousel */}
      <div className="mb-4 flex w-full flex-row items-center justify-between px-5">
        {/* Left Arrow for Navigation */}
        <FontAwesomeIcon
          icon={faCircleArrowLeft}
          onClick={handlePrevious} // Navigate to the previous requirement
          className="cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent"
        />

        {/* Requirement Display */}
        <div className="flex w-full flex-row items-center justify-center p-10">
          {selectedRequirement.requirementType === "image" ? (
            // Display an image if the requirement type is "image"
            <img
              src={selectedRequirement.imageUrl}
              alt={selectedRequirement.requirementName}
              className="mb-4 h-[600px] w-[500px]"
            />
          ) : (
            // Display input fields for non-image requirements
            <div className="ml-4 flex h-auto w-xl flex-col justify-between rounded-[10px] bg-white p-10">
              <div className="flex flex-row items-center justify-between">
                <h2 className="font-bold text-primary mb-5">Requirements</h2>
                <h2 className="font-bold text-primary mb-5">Select All</h2>
              </div>
              {requirements
                .filter(req => req.requirementType === "input") // Filter for input-type requirements
                .map((req, index) => (
                  <div key={req.requirementName} className="flex flex-row items-center justify-between">
                    <div className="mb-4 w-full">
                      <label className="block text-sm font-semibold text-text">
                        {req.requirementName}
                      </label>
                      <Input
                        type="text"
                        defaultValue={req.userInput || ""} // Pre-fill with existing user input
                        className="mt-1 px-4 py-2 block w-full rounded-[10px] border-2 border-text-2 focus:border-accent focus:ring-accent sm:text-sm"
                        onChange={(e) => {
                          console.log(`Input for ${req.requirementName}:`, e.target.value); // Log input changes
                        }}
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCheckSquare} // Icon for marking as complete
                        className="mt-2 ml-5 cursor-pointer text-[46px] text-text-2 transition-all duration-500 ease-in-out hover:text-accent"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Approve or Deny Buttons */}
          <div className="ml-4 flex h-auto w-2xl flex-col items-center justify-center rounded-[10px] bg-white p-4">
            <div className="flex flex-row items-center justify-center gap-x-5 font-semibold text-center">
              {/* Approve Button */}
              <button
                onClick={() => {
                  handleRequirementStatus(true); // Mark the requirement as approved
                  if (isDenied) {
                    setIsDenied(false); // Reset denial state if applicable
                  }
                }}
                className="flex cursor-pointer items-center rounded-[10px] border-2 border-success px-4 py-2 text-base font-semibold text-success transition-all duration-300 ease-in-out hover:scale-115 hover:bg-success hover:text-white"
              >
                APPROVED
                <FontAwesomeIcon icon={faCheckSquare} className="ml-2 text-xl" />
              </button>

              {/* Deny Button */}
              <button
                onClick={() => {
                  handleRequirementStatus(false); // Mark the requirement as denied
                  if (isDenied) {
                    setIsDenied(false); // Reset denial state if applicable
                  }
                }}
                className="flex cursor-pointer items-center rounded-[10px] border-2 border-danger px-9 py-2 text-base font-semibold text-danger transition-all duration-300 ease-in-out hover:scale-115 hover:bg-danger hover:text-white"
              >
                DENY
                <FontAwesomeIcon icon={faSquareXmark} className="ml-2 text-xl" />
              </button>
            </div>

            {/* Denial Reason Input */}
            {isDenied && (
              <>
                <Input
                  type="text"
                  placeholder="Please state the reason for the denial."
                  className="mt-1 px-4 py-2 block w-full rounded-[10px] border-2 border-text-2 focus:border-accent focus:ring-accent sm:text-sm"
                  onChange={(e) => {
                    console.log("Reason for denial:", e.target.value); // Log denial reason
                  }}
                />
                <button
                  className="mt-5 cursor-pointer rounded-[10px] bg-accent px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-primary"
                  onClick={() => {
                    console.log(
                      "Denial reason:",
                      document.querySelector('input[placeholder="Please state the reason for the denial."]')?.value
                    ); // Log the denial reason from the input field
                  }}
                >
                  I confirm, deny requirement
                </button>
              </>
            )}
            <p className="text-text-2 px-10 text-center mt-5">
              Upon denial, the student will receive an automated request to resubmit the application with necessary corrections.
            </p>
          </div>
        </div>

        {/* Right Arrow for Navigation */}
        <FontAwesomeIcon
          icon={faCircleArrowRight}
          onClick={handleNext} // Navigate to the next requirement
          className="cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent"
        />
      </div>
    </div>
  );
};