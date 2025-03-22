import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faSquareXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * EnrollmentList Component
 * 
 * This component displays a multi-panel enrollment management interface that allows users to:
 * - Select grade levels
 * - View sections within a grade level
 * - View students within a section
 * - View and interact with student enrollment requirements
 * 
 * The interface uses a hierarchical selection pattern, where selecting an item in one panel
 * populates the next panel with related data.
 */
const EnrollmentList: React.FC = () => {
  // Extract all required state and functions from the EnrollmentReview context
  const {
    gradeLevels,              // List of available grade levels
    selectedGradeLevel,       // Currently selected grade level ID
    setSelectedGradeLevel,    // Function to update the selected grade level
    sections,                 // List of sections for the selected grade level
    selectedSection,          // Currently selected section ID
    setSelectedSection,       // Function to update the selected section
    students,                 // List of students in the selected section
    selectedStudent,          // Currently selected student object
    setSelectedStudent,       // Function to update the selected student
    requirements,             // List of requirements for the selected student
    selectedRequirement,      // Currently selected requirement object
    setSelectedRequirement,   // Function to update the selected requirement
    isModalOpen,              // Boolean flag for modal visibility
    setIsModalOpen,           // Function to toggle modal visibility
  } = useEnrollmentReview();

  return (
    <div className="w-full flex flex-row">
      {/* 
        Grade Levels Panel
        Displays a scrollable list of all available grade levels
      */}
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

      {/* 
        Sections Panel
        Displays sections available within the selected grade level
      */}
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

      {/* 
        Students Panel
        Displays a table of students in the selected section with application status
      */}
      <div className="border-text-2 w-[600px] h-[530px] border bg-background p-2 shadow-md overflow-y-scroll">
        {/* Student table */}
        <table className="table-auto w-full border-collapse">
          {/* Table header */}
          <thead className="text-text-2 text-left">
            <tr>
              <th className="">#</th>
              <th className="pl-1">STUDENT</th>
              <th className="pl-1">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-sm text-left">
            {/* Student rows - only shown if a section is selected */}
            {selectedSection &&
              students.map((student, index) => (
                <tr
                  key={student.studentId}
                  className={`cursor-pointer hover:bg-accent/50 rounded-[10px] ${
                    selectedStudent?.studentId === student.studentId
                      ? "bg-accent"
                      : ""
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* Student number */}
                  <td className="border-b text-center">{index + 1}</td>
                  
                  {/* Student name - formatted as LASTNAME, FirstName MiddleName */}
                  <td className="border-b p-1">
                    <span className="font-semibold">
                      {student.lastName.toLocaleUpperCase()}
                    </span>, {student.firstName} {student.middleName}
                  </td>
                  
                  {/* Application status with color coding based on status value */}
                  <td className="border-b p-1 text-xs">
                    <span className={`cursor-pointer rounded px-2 py-1 font-semibold transition-all duration-300 ease-in-out ${
                      student.applicationStatus.toLocaleLowerCase().includes("pending")
                        ? "bg-success"
                        : student.applicationStatus.toLocaleLowerCase().includes("accepted")
                          ? "bg-accent"
                          : student.applicationStatus.toLocaleLowerCase().includes("denied")
                            ? "bg-danger"
                            : student.applicationStatus.toLocaleLowerCase().includes("invalid")
                              ? "bg-warning"
                              : "bg-container_1"
                    }`}
                    >
                      {student.applicationStatus}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 
        Requirements Panel
        Displays enrollment requirements for the selected student with status indicators
      */}
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
          <tbody className="text-sm text-left">
            {/* Requirements rows - only shown if a student is selected */}
            {selectedStudent &&
              requirements.map((requirement, index) => (
                <tr key={index} className="hover:bg-accent/50">
                  {/* Requirement name */}
                  <td className="border-b p-1">{requirement.requirementName}</td>
                  
                  {/* Requirement status - displayed as check/x icons */}
                  <td className="border-b p-1">
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
                  <td className="border-b p-1">
                    {requirement.imageUrl && (
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

      {/* 
        Modal Component
        Displays the requirement document image in a modal popup
        Only rendered when isModalOpen is true and a requirement is selected
      */}
      {isModalOpen && selectedRequirement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-[600px]">
            <h2 className="text-lg font-bold mb-4">Requirement Details</h2>
            <img
              src={selectedRequirement.imageUrl}
              alt={selectedRequirement.requirementName}
              className="w-full h-auto mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentList;