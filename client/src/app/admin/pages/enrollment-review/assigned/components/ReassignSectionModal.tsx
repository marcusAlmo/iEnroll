import { Dialog, Transition, Combobox } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faChevronDown, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

/**
 * Interface representing a section in the enrollment system
 * Matches the structure from the mock data
 */
interface Section {
  sectionId: number;  // Unique identifier for the section
  sectionName: string;  // Display name for the section (e.g., "Section A")
}

/**
 * ReassignSectionModal Component
 * 
 * A modal dialog that allows administrators to reassign a student to a different section.
 * It provides a searchable dropdown of available sections from the selected grade level.
 * 
 * Features:
 * - Displays student information
 * - Provides a searchable combobox for section selection
 * - Disables the current section to prevent selecting it again
 * - Validates selection before enabling the confirm button
 * - Only allows reassignment for students with "Accepted" application status
 * 
 * The component uses Headless UI's Dialog and Combobox components for accessibility
 * and a polished user experience.
 * 
 * @returns {JSX.Element} The rendered modal component
 */
export default function ReassignSectionModal() {
  // Extract required state and functions from the enrollment review context
  const {
    isSectionModalOpen,      // Controls modal visibility
    setIsSectionModalOpen,   // Function to toggle modal visibility
    selectedStudent,         // Currently selected student to be reassigned
    sections,                // List of available sections for the selected grade
    selectedSection,         // ID of the currently selected section
  } = useEnrollmentReview();
  
  // State for the selected section in the combobox
  const [selectedNewSection, setSelectedNewSection] = useState<Section | null>(null);
  
  // State for the search query in the combobox
  const [query, setQuery] = useState('');
  
  // Check if the student can be reassigned (only "Accepted" students)
  const canReassign = selectedStudent?.applicationStatus === "Accepted";
  
  /**
   * Closes the modal and resets the form state
   */
  const closeModal = () => {
    setIsSectionModalOpen(false);
    setSelectedNewSection(null);
    setQuery('');
  }
  
  /**
   * Handles the confirmation of section reassignment
   * Currently logs the action and closes the modal
   * Please replace with the actual API call
   */
  const handleConfirm = () => {
    if (selectedNewSection && selectedStudent) {
      console.log(`Reassigning student ${selectedStudent.studentName} to section ${selectedNewSection.sectionName}`);
      closeModal();
    }
  }

  /**
   * Filters sections based on the search query
   * Returns all sections if query is empty, otherwise filters by section name
   */
  const filteredSections = query === ''
    ? sections
    : sections.filter((section) =>
        section.sectionName.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Transition appear show={isSectionModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-10 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                
                {/* Modal header */}
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-text"
                >
                  <div className='flex flex-col justify-center text-center'>
                  <FontAwesomeIcon icon={faArrowsRotate} className="text-secondary text-8xl" />
                    <h2 className="text-2xl font-semibold text-primary">
                      Reassign Student?
                    </h2>
                    <p className="mx-5 text-center text-sm font-normal text-text-2">
                      This action will move the student into different section rather than their chosen.
                    </p>
                  </div>
                  
                  
                </Dialog.Title>
                
                {/* Modal content */}
                <div className="mt-10">
                  {/* Warning message if student cannot be reassigned */}
                  {!canReassign && (
                    <div className="mb-6 p-4 bg-warning/20 rounded-lg border border-warning">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning mr-2" />
                        <p className="text-sm text-text">
                          Only students with <span className="font-semibold">Accepted</span> application status can be reassigned to a different section.
                        </p>
                      </div>
                    </div>
                  )}
  
                  {/* Section selector - only shown if student can be reassigned */}
                  {canReassign && (
                    <div className="mt-6">
                      <label htmlFor="section-combobox" className="block text-sm font-medium text-text mb-2">
                        Select New Section for <span className='font-semibold'>{selectedStudent?.studentName}</span>
                      </label>
                      <Combobox 
                        value={selectedNewSection} 
                        onChange={setSelectedNewSection}
                      >
                        <div className="relative">
                          {/* Combobox input */}
                          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-text-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                            <Combobox.Input
                              id="section-combobox"
                              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-text focus:ring-0"
                              displayValue={(section: Section | null) => section?.sectionName || ''}
                              onChange={(event) => setQuery(event.target.value)}
                              placeholder="Select a section"
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                              <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-text-2" aria-hidden="true" />
                            </Combobox.Button>
                          </div>
                          
                          {/* Combobox dropdown */}
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                          >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 z-50 focus:outline-none sm:text-sm">
                              {filteredSections.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-text">
                                  Nothing found.
                                </div>
                              ) : (
                                filteredSections.map((section) => (
                                  <Combobox.Option
                                    key={section.sectionId}
                                    className={({ active }) =>
                                      `relative cursor-pointer py-2 pr-4 pl-10 transition-all duration-600 select-none ${
                                        active ? 'bg-primary text-white' : 'text-text'
                                      } ${section.sectionId === selectedSection ? 'opacity-50 cursor-not-allowed' : ''}`
                                    }
                                    value={section}
                                    disabled={section.sectionId === selectedSection}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                          {section.sectionName}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active ? 'text-white' : 'text-primary'
                                            }`}
                                          >
                                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                            </svg>
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          </Transition>
                        </div>
                      </Combobox>
                    </div>
                  )}
                </div>

                {/* Modal footer with action buttons */}
                <div className="mt-10 flex justify-center gap-x-4 w-full">
                  <button
                    type="button"
                    className="w-1/2 cursor-pointer px-4 py-2 text-sm font-medium text-white bg-danger rounded-[10px] hover:bg-danger/60 button-transition"
                    onClick={handleConfirm}
                    disabled={!selectedNewSection || !canReassign}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="w-1/2 cursor-pointer px-4 py-2 text-sm font-medium text-text-2 bg-background border border-text-2 rounded-[10px] hover:bg-text-2/30 button-transition"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}