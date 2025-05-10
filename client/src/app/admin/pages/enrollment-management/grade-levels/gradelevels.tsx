import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { requestData } from '@/lib/dataRequester';
import { FiTrash } from 'react-icons/fi';

interface GradeLevelsInterface {
  gradeLevel: string;
  gradeSectionProgramId: number;
  gradeLevelOfferedId: number;
  sections: {
    gradeSectionProgramId: number;
    sectionId: number;
    sectionName: string;
    adviser: string | null;
    admissionSlot: number;
    maxApplicationSlot: number;
    isCustomProgram: boolean;
    programDetails:
      | {
          program: string;
          description: string;
        }
      | undefined;
  }[];
};

interface ProgramInterface {
  program: string;
  programId: number;
  description: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full pointer-events-auto shadow-xl border-2 border-gray-300">
        <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
        <p className="text-text mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-text-2 rounded-lg hover:bg-text-2/20 cursor-pointer button-transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer button-transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const GradeLevels: React.FC = () => {
  // State for selected grade level and section
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // State for deleting the section
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);
  
  // State for section details
  const [sectionDetails, setSectionDetails] = useState<{
    sectionName: string;
    sectionId: number;
    sectionAdviser: string;
    sectionCapacity: number;
    maximumApplication: number;
    isCustomProgram: boolean;
    customProgramDetails?: { 
      program: string; 
      programId: number;
      description: string 
    };
  } | null>(null);

  // State for managing new section creation
  const [isNewSection, setIsNewSection] = useState<boolean>(false);
  const [data, setData] = useState<GradeLevelsInterface[]>([]);
  
  // State for programs dropdown
  const [programs, setPrograms] = useState<ProgramInterface[]>([]);

  // Handle grade level selection
  const handleGradeLevelClick = (gradeLevel: string) => {
    setSelectedGradeLevel(gradeLevel);
    setSelectedSection(null); // Reset section when grade level changes
    setSectionDetails(null); // Clear section details
    setIsNewSection(false); // Reset new section state
    setIsEditing(false); // Reset editing state
  };

  // Handle section selection
  const handleSectionClick = (sectionName: string) => {
    setSelectedSection(sectionName);
    setIsEditing(false); // Reset editing state when selecting a section

    // Find the selected section details
    const gradeLevelDetails = data.find(
      (grade) => grade.gradeLevel === selectedGradeLevel
    );

    if (gradeLevelDetails) {
      const sectionInfo = gradeLevelDetails.sections.find(
        (section) => section.sectionName === sectionName
      );

      if (sectionInfo) {
        // Find matching program - make case insensitive comparison
        const matchingProgram = programs.find(
          p => p.program.toUpperCase() === sectionInfo.programDetails?.program?.toUpperCase()
        );
        
        setSectionDetails({
          sectionName: sectionInfo.sectionName,
          sectionId: sectionInfo.sectionId,
          sectionAdviser: sectionInfo.adviser || '',
          sectionCapacity: sectionInfo.admissionSlot,
          maximumApplication: sectionInfo.maxApplicationSlot,
          isCustomProgram: sectionInfo.isCustomProgram,
          customProgramDetails: {
            program: sectionInfo.programDetails?.program || '',
            programId: matchingProgram?.programId || 0, // Make sure to set programId
            description: sectionInfo.programDetails?.description || ''
          }
        });
      }
    }

    setIsNewSection(false); // Reset new section state
  };

  // handle delete section
  const handleDeleteSection = (sectionId: number) => {
    if (!selectedGradeLevel || !sectionId) return;
    
    setSectionToDelete(sectionId);
    setIsDeleteModalOpen(true);
  };

  // confirms deletion of section
  const confirmDelete = async () => {
    if (!selectedGradeLevel || !sectionToDelete) return;
    
    await deleteSection(sectionToDelete);

    // Reset states after deletion
    setSelectedSection(null);
    setSectionDetails(null);
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  const deleteSection = async (sectionId: number) => {
    try {
      const response = await requestData<{message: string}>({
        url: `http://localhost:3000/api/grade-levels/delete/${sectionId}`,
        method: 'DELETE',
      });

      if (response) {
        toast.success('Section deleted successfully');
        await retrieveGradeLevels();
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");

      console.error(error);
    }
  }

  // cancels deletion of section
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSectionToDelete(null);
  };

  // Handle "Edit Section" button click
  const handleEditSection = () => {
    setIsEditing(true);
  };

  // Handle "Add New Section" button click
  const handleAddNewSection = () => {
    // Use the first program from programsList for default values
    const defaultProgram = programs[0];
    
    setSectionDetails({
      sectionName: "",
      sectionId: 0,
      sectionAdviser: "",
      sectionCapacity: 0,
      maximumApplication: 0,
      isCustomProgram: false,
      customProgramDetails: {
        program: defaultProgram.program,
        programId: defaultProgram.programId,
        description: defaultProgram.description
      },
    });
  
    setIsNewSection(true); // Enable new section creation mode
    setIsEditing(false); // Ensure editing mode is off
  };

  // Handle input changes for section details
  // eslint-disable-next-line
  const handleInputChange = (field: string, value: any) => {
    if (sectionDetails && (isNewSection || isEditing)) {
      setSectionDetails({
        ...sectionDetails,
        [field]: value
      });
    }
  };
  
  // Handle program selection change
  const handleProgramChange = (programId: number) => {
    if (sectionDetails && (isNewSection || isEditing)) {
      const selectedProgram = programs.find(p => p.programId === programId);
      
      if (selectedProgram) {
        setSectionDetails({
          ...sectionDetails,
          customProgramDetails: {
            program: selectedProgram.program,
            programId: selectedProgram.programId,
            description: selectedProgram.description
          }
        });
      }
    }
  };
  
  // Handle create new section submission
  const handleCreateSection = async () => {
    if (!sectionDetails || !selectedGradeLevel) return;

    try {
      // Structure the data for API request
      const requestBody = {
        gradeLevelOfferedId: data.find(g => g.gradeLevel === selectedGradeLevel)?.gradeLevelOfferedId,
        sectionName: sectionDetails.sectionName,
        adviser: sectionDetails.sectionAdviser,
        admissionSlot: sectionDetails.sectionCapacity,
        maxApplicationSlot: sectionDetails.maximumApplication,
        isCustomProgram: sectionDetails.isCustomProgram,
        programDetails: sectionDetails.isCustomProgram ? {
          program: sectionDetails.customProgramDetails?.program,
          description: sectionDetails.customProgramDetails?.description
        } : undefined
      };

      // Actual API call would go here
      console.log("Creating new section:", requestBody);
      
      toast.success(`Section ${sectionDetails.sectionName} created successfully!`);
      
      // Reset form and refresh data
      await retrieveGradeLevels();
      setIsNewSection(false);
      setSelectedSection(sectionDetails.sectionName);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");
      console.error(error);
    }
  };

  // Handle update section submission
  const handleUpdateSection = async () => {
    if (!sectionDetails || !selectedGradeLevel || !selectedSection) return;
    
    try {
      console.log({
        gradeLevelOfferedId: data.find(g => g.gradeLevel === selectedGradeLevel)?.gradeLevelOfferedId,
        sectionId: sectionDetails.sectionId,
        programName: sectionDetails.customProgramDetails?.program,
        programId: sectionDetails.customProgramDetails?.programId,
        sectionName: sectionDetails.sectionName,
        adviser: sectionDetails.sectionAdviser,
        admissionSlot: sectionDetails.sectionCapacity,
        maxApplicationSlot: sectionDetails.maximumApplication,
        gradeSectionProgramId: data.find(g => g.gradeLevel === selectedGradeLevel)?.gradeSectionProgramId,
        isUpdate: true
      });

      const response = await requestData<{ message: string}>({
        url: 'http://localhost:3000/api/grade-levels/receive',
        method: "POST",
        body: {
          gradeLevelOfferedId: data.find(g => g.gradeLevel === selectedGradeLevel)?.gradeLevelOfferedId,
          sectionId: sectionDetails.sectionId,
          programName: sectionDetails.customProgramDetails?.program,
          programId: sectionDetails.customProgramDetails?.programId,
          sectionName: sectionDetails.sectionName,
          adviser: sectionDetails.sectionAdviser,
          admissionSlot: sectionDetails.sectionCapacity,
          maxApplicationSlot: sectionDetails.maximumApplication,
          gradeSectionProgramId: data.find(g => g.gradeLevel === selectedGradeLevel)?.gradeSectionProgramId,
          isUpdate: true
        }
      });
      
      if (response) {
        toast.success(response.message);
      
        // Reset editing state
        setIsEditing(false);

        // Update the selected section if section name changed
        if (sectionDetails.sectionName !== selectedSection) {
          setSelectedSection(sectionDetails.sectionName);
        }

        // Refresh data from server
        await retrieveGradeLevels();
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");
      console.error(error);
    }
  };

  // Handle cancel button click
  const handleCancelNewSection = () => {
    setIsNewSection(false);
    if (selectedSection) {
      // Go back to previously selected section if there was one
      handleSectionClick(selectedSection);
    } else {
      setSectionDetails(null);
    }
  };

  // Handle cancel edit button click
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedSection) {
      // Revert to original section details
      handleSectionClick(selectedSection);
    }
  };

  // Toggle custom program checkbox
  const handleToggleCustomProgram = (checked: boolean) => {
    if (!sectionDetails) return;
    
    // Use the first program from programsList for default values
    const defaultProgram = programs[0];
  
    setSectionDetails({
      ...sectionDetails,
      isCustomProgram: checked,
      customProgramDetails: checked
        ? sectionDetails.customProgramDetails || { 
            program: defaultProgram.program, 
            programId: defaultProgram.programId,
            description: defaultProgram.description 
          }
        : undefined,
    });
  };

  // retrieve collections of grade levels from server
  const retrieveGradeLevels = async () => {
    try {
      const response = await requestData<GradeLevelsInterface[]>({
        url: 'http://localhost:3000/api/grade-levels/fetch',
        method: 'GET'
      })

      if (response) {
        setData(response)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");

      console.error(error);
    }
  }

  // retrieve programs from server (if you have an API for this)
  const retrievePrograms = async () => {
    try {
      // Uncomment this when you have an actual API endpoint
      const response = await requestData<{programList: ProgramInterface[]}>({
        url: 'http://localhost:3000/api/grade-levels/retrieve-programs',
        method: 'GET'
      })

      if (response) {
        setPrograms(response.programList)
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred.");

      console.error(error);
    }
  }

  // execute retrieval
  useEffect(() => {
    retrieveGradeLevels();
    retrievePrograms();
  }, [])
  
  return (
    <div className="flex flex-row gap-4 justify-center pt-7 px-8 w-full">
      {/* Left Panel: Grade Levels and Sections */}
      <div className="bg-background h-[480px] rounded-lg shadow-md flex flex-row w-4/12">
        <div className="border-r-2 border-text-2 px-3 py-3 w-3/6">
          <h2 className="text-text-2 font-semibold text-base">GRADE LEVELS</h2>
          <ul className="mt-4">
            {data.map((grade, index) => (
              <li
                key={index}
                className={`text-text-1 button-transition flex cursor-pointer flex-col gap-y-2 rounded-full px-3 py-1 text-sm hover:scale-105 hover:bg-accent/50 ${
                  selectedGradeLevel === grade.gradeLevel ? "bg-accent font-semibold" : ""
                }`}
                onClick={() => handleGradeLevelClick(grade.gradeLevel)}
              >
                {grade.gradeLevel}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-3 py-3 w-3/6">
          <h2 className="text-text-2 font-semibold text-base">SECTION</h2>
          <div className="mt-4">
            {selectedGradeLevel &&
              data
                .filter((grade) => grade.gradeLevel === selectedGradeLevel)
                .map((grade, index) => (
                  <div key={index}>
                    {grade.sections.map((section, sectionIndex) => (
                      <div
                        key={sectionIndex}
                        className={`text-text-1 button-transition flex cursor-pointer flex-col gap-y-2 rounded-full px-3 py-1 text-sm hover:scale-105 hover:bg-accent/50 ${
                          selectedSection === section.sectionName ? "bg-accent font-semibold" : ""
                        }`}
                        onClick={() => handleSectionClick(section.sectionName)}
                      >
                        {section.sectionName}
                      </div>
                    ))}
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Section Details */}
      <div className="bg-background h-[480px] rounded-lg shadow-md flex flex-col w-5/12 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text font-semibold text-base">
            {isNewSection ? "Add New Section" : isEditing ? "Edit Section" : "Section Details"}
          </h2>
          <div className="flex gap-2">
            {!isNewSection && !isEditing && selectedSection && (
              <button
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/80 cursor-pointer button-transition"
                onClick={handleEditSection}
              >
                Edit Section
              </button>
            )}
            {!isNewSection && !isEditing && (
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 cursor-pointer button-transition"
                onClick={handleAddNewSection}
              >
                Add New Section
              </button>
            )}
          </div>
        </div>

        {sectionDetails && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-text text-sm font-medium mb-1">
                Section Name
              </label>
              <input
                type="text"
                value={sectionDetails.sectionName}
                onChange={(e) => handleInputChange("sectionName", e.target.value)}
                readOnly={!(isNewSection || isEditing)}
                className={`w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 ${
                  !(isNewSection || isEditing) ? "opacity-75" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-text text-sm font-medium mb-1">
                Section Adviser
              </label>
              <input
                type="text"
                value={sectionDetails.sectionAdviser}
                onChange={(e) => handleInputChange("sectionAdviser", e.target.value)}
                readOnly={!(isNewSection || isEditing)}
                className={`w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 ${
                  !(isNewSection || isEditing) ? "opacity-75" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-text text-sm font-medium mb-1">
                Section Capacity
              </label>
              <input
                type="number"
                value={sectionDetails.sectionCapacity}
                onChange={(e) => handleInputChange("sectionCapacity", parseInt(e.target.value) || 0)}
                readOnly={!(isNewSection || isEditing)}
                className={`w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 ${
                  !(isNewSection || isEditing) ? "opacity-75" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-text text-sm font-medium mb-1">
                Maximum Application
              </label>
              <input
                type="number"
                value={sectionDetails.maximumApplication}
                onChange={(e) => handleInputChange("maximumApplication", parseInt(e.target.value) || 0)}
                readOnly={!(isNewSection || isEditing)}
                className={`w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 ${
                  !(isNewSection || isEditing) ? "opacity-75" : ""
                }`}
              />
            </div>
            
            {/* Show the checkbox when adding a new section or editing */}
            {(isNewSection || isEditing) && (
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(!sectionDetails.isCustomProgram)}
                    onChange={(e) => handleToggleCustomProgram(e.target.checked)}
                    className="form-checkbox h-4 w-4 cursor-pointer rounded border-text-2 text-primary focus:ring-accent"
                  />
                  <span className="text-text text-sm">Custom Program?</span>
                </label>
              </div>
            )}

            {/* Show input fields for custom program when checkbox is checked during new section creation or editing */}
            {(isNewSection || isEditing) && (!sectionDetails.isCustomProgram) && (
              <div className="flex flex-col gap-2">
                <h3 className="text-text font-semibold">Custom Program Details</h3>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Program Name
                  </label>
                  {programs.length === 0 ? (
                    <div className="text-text-2 text-sm">Loading programs...</div>
                  ) : (
                    <select
                      value={sectionDetails.customProgramDetails?.programId || ''}
                      onChange={(e) => handleProgramChange(parseInt(e.target.value))}
                      className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2"
                    >
                      {programs.map(program => (
                        <option key={program.programId} value={program.programId}>
                          {program.program}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={sectionDetails.customProgramDetails?.description || ""}
                    readOnly
                    className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2"
                    rows={4}
                  />
                </div>
              </div>
            )}
            
            {/* Add buttons for form actions */}
            {isNewSection && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 border border-text-2 rounded-lg hover:bg-text-2/20 cursor-pointer button-transition"
                  onClick={handleCancelNewSection}
                >
                  Cancel
                </button>
                <button
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 cursor-pointer button-transition"
                  onClick={handleCreateSection}
                >
                  Create New Section
                </button>
              </div>
            )}

            {/* Update and Cancel buttons for editing mode */}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 border border-text-2 rounded-lg hover:bg-text-2/20 cursor-pointer button-transition"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/80 cursor-pointer button-transition"
                  onClick={handleUpdateSection}
                >
                  Save Changes
                </button>
              </div>
            )}
            
            {/* Delete button */}
            {!isNewSection && !isEditing && selectedSection && (
              <div className="flex justify-center mt-6">
                <button
                  className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                  onClick={() => handleDeleteSection(sectionDetails.sectionId)}
                >
                  <FiTrash size={18} />
                  <span>Delete Section</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this section?`}
      />
    </div>
  );
};

export default GradeLevels;