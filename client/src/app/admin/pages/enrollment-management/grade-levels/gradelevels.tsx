import React from 'react';
import TestData from "./test/testData.json";
import SectionAdviserData from "./test/sectionAdviser.json";

const GradeLevels: React.FC = () => {
  // State for selected grade level and section
  const [selectedGradeLevel, setSelectedGradeLevel] = React.useState<string | null>(null);
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [isCustomProgram, setIsCustomProgram] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  
  // State for section details
  const [sectionDetails, setSectionDetails] = React.useState<{
    sectionName: string;
    sectionAdviser: string;
    sectionCapacity: number;
    maximumApplication: number;
    isCustomProgram: boolean;
    customProgramDetails?: { program: string; description: string };
  } | null>(null);

  // State for managing new section creation
  const [isNewSection, setIsNewSection] = React.useState<boolean>(false);

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
    const gradeLevelDetails = TestData.gradeLevels.find(
      (grade) => grade.gradeLevel === selectedGradeLevel
    );

    if (gradeLevelDetails) {
      const sectionInfo = gradeLevelDetails.sections.find(
        (section) => section.sectionName === sectionName
      );

      if (sectionInfo) {
        setSectionDetails({
          sectionName: sectionInfo.sectionName,
          sectionAdviser: sectionInfo.sectionAdviser,
          sectionCapacity: sectionInfo.sectionCapacity,
          maximumApplication: sectionInfo.maximumApplication,
          isCustomProgram: sectionInfo.isCustomProgram,
          customProgramDetails: sectionInfo.isCustomProgram
            ? sectionInfo.customProgramDetails
            : undefined,
        });
        setIsCustomProgram(sectionInfo.isCustomProgram);
      }
    }

    setIsNewSection(false); // Reset new section state
  };

  // Handle "Edit Section" button click
  const handleEditSection = () => {
    setIsEditing(true);
  };

  // Handle "Add New Section" button click
  const handleAddNewSection = () => {
    setSectionDetails({
      sectionName: "",
      sectionAdviser: "",
      sectionCapacity: 0,
      maximumApplication: 0,
      isCustomProgram: false,
      customProgramDetails: undefined,
    });
  
    setIsCustomProgram(false); // Reset the checkbox state
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
  
  // Handle custom program details changes
  const handleCustomProgramChange = (field: string, value: string) => {
    if (sectionDetails && (isNewSection || isEditing)) {
      setSectionDetails({
        ...sectionDetails,
        customProgramDetails: {
          ...(sectionDetails.customProgramDetails || { program: "", description: "" }),
          [field]: value
        }
      });
    }
  };
  
  // Handle create new section submission
  const handleCreateSection = () => {
    if (!sectionDetails || !selectedGradeLevel) return;
    // Please remove before deployment and replace with acutal API call
    console.log("Creating new section:", {
      gradeLevel: selectedGradeLevel,
      section: sectionDetails
    });
    
    // For demo purpose, we'll just reset the form
    setIsNewSection(false);
    setSelectedSection(sectionDetails.sectionName);
    
    alert(`Section ${sectionDetails.sectionName} created successfully!`);
  };

  // Handle update section submission
  const handleUpdateSection = () => {
    if (!sectionDetails || !selectedGradeLevel || !selectedSection) return;
    
    console.log("Updating section:", {
      gradeLevel: selectedGradeLevel,
      section: sectionDetails
    });
    
    setIsEditing(false);
    
    // Update the selected section if section name changed
    if (sectionDetails.sectionName !== selectedSection) {
      setSelectedSection(sectionDetails.sectionName);
    }

    alert(`Section ${sectionDetails.sectionName} updated successfully!`);
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
    setIsCustomProgram(checked);
    if (sectionDetails) {
      setSectionDetails({
        ...sectionDetails,
        isCustomProgram: checked,
        customProgramDetails: checked 
          ? (sectionDetails.customProgramDetails || { program: "", description: "" })
          : undefined
      });
    }
  };
  
  return (
    <div className="flex flex-row gap-4 justify-center pt-7 px-8 w-full">
      {/* Left Panel: Grade Levels and Sections */}
      <div className="bg-background h-[480px] rounded-lg shadow-md flex flex-row w-4/12">
        <div className="border-r-2 border-text-2 px-3 py-3 w-3/6">
          <h2 className="text-text-2 font-semibold text-base">GRADE LEVELS</h2>
          <ul className="mt-4">
            {TestData.gradeLevels.map((grade, index) => (
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
              TestData.gradeLevels
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
                    checked={isCustomProgram}
                    onChange={(e) => handleToggleCustomProgram(e.target.checked)}
                    className="form-checkbox button-transition h-4 w-4 cursor-pointer rounded border-text-2 text-primary focus:ring-accent"
                  />
                  <span className="text-text text-sm">Custom Program?</span>
                </label>
              </div>
            )}

            {/* Show input fields for custom program when checkbox is checked during new section creation or editing */}
            {(isNewSection || isEditing) && isCustomProgram && (
              <div className="flex flex-col gap-2">
                <h3 className="text-text font-semibold">Custom Program Details</h3>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Program Name
                  </label>
                  <input
                    type="text"
                    value={sectionDetails?.customProgramDetails?.program || ""}
                    onChange={(e) => handleCustomProgramChange("program", e.target.value)}
                    className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={sectionDetails?.customProgramDetails?.description || ""}
                    onChange={(e) => handleCustomProgramChange("description", e.target.value)}
                    className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2"
                  />
                </div>
              </div>
            )}
            
            {/* Show custom program details when viewing existing section with custom program */}
            {!isNewSection && !isEditing && sectionDetails.isCustomProgram && sectionDetails.customProgramDetails && (
              <div className="flex flex-col gap-2">
                <h3 className="text-text font-semibold">Custom Program</h3>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Program Name
                  </label>
                  <input
                    type="text"
                    value={sectionDetails.customProgramDetails.program}
                    readOnly
                    className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 opacity-75"
                  />
                </div>
                <div>
                  <label className="block text-text text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={sectionDetails.customProgramDetails.description}
                    readOnly
                    className="w-full rounded-lg border border-text-2 bg-container-1 px-3 py-2 opacity-75"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeLevels;