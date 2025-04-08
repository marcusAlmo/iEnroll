import React, { useState } from 'react';
import { Input } from '@headlessui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCheckSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

export const RequirementsCarouselModal: React.FC = () => {
  const {
    selectedRequirement,
    requirements,
    handleNext,
    handlePrevious,
    handleRequirementStatus,
    isModalOpen,
    setIsModalOpen,
  } = useEnrollmentReview();
  // local declaration here kasi nagkakaproblema sa context nagstastale
  const [showDenialReason, setShowDenialReason] = useState(false);
  const [denialReason, setDenialReason] = useState(''); // State to store the denial reason

  if (!isModalOpen || !requirements.length || !selectedRequirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex justify-end">
        <button
          className="absolute top-2 right-2 cursor-pointer rounded-[10px] bg-danger px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-red-950 hover:scale-115"
          onClick={() => setIsModalOpen(false)}
        >
          Exit
        </button>
      </div>

      <div className="mb-4 flex w-full flex-row items-center justify-between px-5">
        <FontAwesomeIcon
          icon={faCircleArrowLeft}
          onClick={() => {
            handlePrevious();
            setShowDenialReason(false);
          }}
          className="cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent"
        />

        <div className="flex w-full flex-row items-center justify-center p-10">
          {selectedRequirement.requirementType === "image" ? (
            <img
              src={selectedRequirement.imageUrl}
              alt={selectedRequirement.requirementName}
              className="mb-4 h-[600px] w-[500px]"
            />
          ) : (
            <div className="ml-4 flex h-auto w-xl flex-col justify-between rounded-[10px] bg-white p-10">
              <label htmlFor="requirementType" className="font-semibold text-primary mb-2">
                {selectedRequirement.requirementName}
              </label>
              <Input
                id="requirementType"
                type="text"
                value={selectedRequirement.userInput}
                readOnly
                className="block w-full rounded-[10px] border-2 border-text-2 px-4 py-2 focus:border-accent focus:ring-accent sm:text-sm"
                />
              {/* <div className="flex flex-row items-center justify-between">
                <h2 className="font-bold text-primary mb-5">Requirements</h2>
                <h2 className="font-bold text-primary mb-5">Select All</h2>
              </div>
              {requirements
                .filter(req => req.requirementType === "input")
                .map((req, index) => (
                  <div key={req.requirementName} className="flex flex-row items-center justify-between">
                    <div className="mb-4 w-full">
                      <label className="block text-sm font-semibold text-text">
                        {req.requirementName}
                      </label>
                      <Input
                        type="text"
                        defaultValue={req.userInput || ""}
                        className="mt-1 px-4 py-2 block w-full rounded-[10px] border-2 border-text-2 focus:border-accent focus:ring-accent sm:text-sm"
                        onChange={(e) => {
                          console.log(`Input for ${req.requirementName}:`, e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <FontAwesomeIcon
                        icon={faCheckSquare}
                        className="mt-2 ml-5 cursor-pointer text-[46px] text-text-2 transition-all duration-500 ease-in-out hover:text-accent"
                      />
                    </div>
                  </div>
                ))} */}
            </div>
          )}

          <div className="ml-4 flex h-auto w-2xl flex-col items-center justify-center rounded-[10px] bg-white p-5">
            <div className="flex flex-row items-center justify-center gap-x-5 font-semibold text-center">
              <button
                onClick={() => {
                  handleRequirementStatus(true);
                  setShowDenialReason(false);
                }}
                className="flex cursor-pointer items-center rounded-[10px] border-2 border-success px-4 py-2 text-base font-semibold text-success transition-all duration-300 ease-in-out hover:scale-115 hover:bg-success hover:text-white"
              >
                APPROVED
                <FontAwesomeIcon icon={faCheckSquare} className="ml-2 text-xl" />
              </button>

              <button
                onClick={() => setShowDenialReason(true)}
                className="flex cursor-pointer items-center rounded-[10px] border-2 border-danger px-9 py-2 text-base font-semibold text-danger transition-all duration-300 ease-in-out hover:scale-115 hover:bg-danger hover:text-white"
              >
                DENY
                <FontAwesomeIcon icon={faSquareXmark} className="ml-2 text-xl" />
              </button>
            </div>

            {showDenialReason && (
              <>
                <Input
                  type="text"
                  placeholder="Please state the reason for the denial."
                  className="mt-1 h-[150px] px-4 py-2 block w-full rounded-[10px] border-2 border-text-2 focus:border-accent focus:ring-accent sm:text-sm"
                  onChange={(e) => setDenialReason(e.target.value)} // Update denial reason state
                />
                <button
                  onClick={() => {
                    console.log("Submitting denial reason:", denialReason); // Log the denial reason
                    handleRequirementStatus(false, denialReason); // Pass the denial reason to the handler
                    setShowDenialReason(false);
                  }}
                  className="mt-5 cursor-pointer rounded-[10px] bg-accent px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-primary"
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

        <FontAwesomeIcon
          icon={faCircleArrowRight}
          onClick={() => {
            handleNext();
            setShowDenialReason(false);
          }}
          className="cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent"
        />
      </div>
    </div>
  );
};
