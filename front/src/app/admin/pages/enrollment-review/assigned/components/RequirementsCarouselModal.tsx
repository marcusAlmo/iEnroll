import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCheckSquare, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';
import TextField from '@mui/material/TextField';


export const RequirementsCarouselModal: React.FC = () => {
  const {
    requirements,
    currentIndex,
    handleNext,
    handlePrevious,
    handleRequirementStatus,
    isModalOpen,
    setIsModalOpen,
    isDenied,
    setIsDenied,
  } = useEnrollmentReview();

  if (!isModalOpen || !requirements.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex justify-end">
        {/* Exit button */}
        <button
          className="absolute top-2 right-2 cursor-pointer rounded-[10px] bg-danger px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-red-950 hover:scale-115"
          onClick={() => setIsModalOpen(false)}
        >
          Exit
        </button>
      </div>
      {/* Carousel */}
      <div className="mb-4 flex w-full flex-row items-center justify-between px-5">
        <FontAwesomeIcon 
          icon={faCircleArrowLeft}
          onClick={handlePrevious}
          className='cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent'
        />
        {/* Requirement */}
        <div className='flex w-full flex-row items-center justify-center p-10'>
          <img
            src={requirements[currentIndex].imageUrl}
            alt={requirements[currentIndex].requirementName}
            className="mb-4 h-[600px] w-[500px]"
          />
          {/* Approve or Deny Requirement */}
          <div className='ml-4 flex h-auto w-2xl flex-col items-center justify-center rounded-[10px] bg-white p-4'>
            <div className='flex flex-row items-center justify-center gap-x-5 font-semibold text-center'>
              <button
                onClick={() => {
                  handleRequirementStatus(true)
                  if (isDenied) {
                    setIsDenied(false);
                  }
                }}
                className='flex cursor-pointer items-center rounded-[10px] border-2 border-success px-4 py-2 text-base font-semibold text-success transition-all duration-300 ease-in-out hover:scale-115 hover:bg-success hover:text-white'> 
                APPROVED
                <FontAwesomeIcon icon={faCheckSquare} className="ml-2 text-xl" />
              </button>

              <button 
                onClick={() => {
                  setIsDenied(true);
                  handleRequirementStatus(false);
                }}
                className='flex cursor-pointer items-center rounded-[10px] border-2 border-danger px-9 py-2 text-base font-semibold text-danger transition-all duration-300 ease-in-out hover:scale-115 hover:bg-danger hover:text-white'>
                DENY
                <FontAwesomeIcon icon={faSquareXmark} className="ml-2 text-xl" />
              </button>
            </div>
            {/* If denied text field */}
            {isDenied && (
              <>
                <TextField
                  label="If Denied"
                  placeholder="Please state the reason for the denial. "
                  fullWidth
                  margin="normal"
                  // onChange={(e) => {
                  //   // Optionally, you can log or handle the reason for denial here
                  //   console.log("Reason for denial:", e.target.value);
                  // }}
                />
                <button
                  className='mt-5 cursor-pointer rounded-[10px] bg-accent px-4 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:bg-primary'
                  onClick={() => {
                    console.log("Denial reason:", document.querySelector('input[placeholder="Please state the reason for the denial. "]')?.value);
                  }}>
                    I confirm, deny requirement
                </button>
              </>  
            )}
            <p className='text-text-2 px-10 text-center mt-5'>Upon denial, the student will receive an automated request to resubmit the application with necessary corrections.</p>
          </div>
        </div>
        <FontAwesomeIcon 
          icon={faCircleArrowRight}
          onClick={handleNext}
          className='cursor-pointer text-7xl text-white transition-all duration-300 ease-in-out hover:scale-115 hover:text-accent'
        />
      </div>
    </div>
  );
};