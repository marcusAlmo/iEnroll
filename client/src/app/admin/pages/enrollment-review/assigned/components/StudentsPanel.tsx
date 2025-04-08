import React, {useState} from 'react';
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * StudentsPanel Component
 * 
 * This functional component displays a panel that lists the students in the selected section.
 * It provides a table view of the students, their names, and application statuses.
 * Users can select a student to update the application state and trigger downstream changes
 * in other panels (e.g., RequirementsPanel).
 * 
 * The component relies on the `useEnrollmentReview` context to manage:
 * - The list of students in the selected section.
 * - The currently selected student.
 * - A function to update the selected student.
 */
export const StudentsPanel: React.FC = () => {
  // Destructure required state and functions from the EnrollmentReview context
  const {
    selectedSection,          // ID of the currently selected section
    students,                 // List of students in the selected section
    selectedStudent,          // Object representing the currently selected student
    setSelectedStudent,       // Function to update the selected student
    setIsSectionModalOpen,
  } = useEnrollmentReview();

  // Check if the current section is "Unassigned"
  const isUnassignedSection = selectedSection === 999;

  // Function to handle button click
  const handleSectionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSectionModalOpen(true);
  };

  return (
    <div className="border-text-2 w-[600px] h-[530px] border bg-background p-2 shadow-md overflow-y-scroll">
      {/* Student Table */}
      <table className="table-auto w-full border-collapse">
        {/* Table Header */}
        <thead className="text-text-2 text-left justify-between w-full">
          <tr>
            <th className="">#</th>                  {/* Column for student number */}
            <th className="pl-1">STUDENT</th>        {/* Column for student names */}
            <th className="pl-1">STATUS</th>         {/* Column for application status */}
            <th className="pl-1">
            <button 
              onClick={handleSectionButtonClick}
              className='bg-text-2 text-text font-semibold px-4 py-1 rounded-[5px] text-xs my-1 cursor-pointer button-transition hover:scale-105'>
              {isUnassignedSection ? 'Assign Section' : 'Reassign Section'}
            </button>  
            </th> 
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-sm text-left w-full">
          {/* Student Rows - Only shown if a section is selected */}
          {selectedSection &&
            students.map((student, index) => (
              <tr
                key={student.studentId} // Unique identifier for each student
                className={`cursor-pointer hover:bg-accent/50 rounded-[10px] w-full ${
                  selectedStudent?.studentId === student.studentId
                    ? "bg-accent" // Highlight the selected student
                    : ""
                }`}
                onClick={() => setSelectedStudent(student)} // Update the selected student on click
              >
                {/* Student Number */}
                <td className="border-b text-center">{index + 1}</td>

                {/* Student Name - Formatted as LASTNAME, FirstName MiddleName */}
                <td className="border-b p-">
                  <span className="font-semibold">
                    {student.lastName.toLocaleUpperCase()}
                  </span>, {student.firstName} {student.middleName}
                </td>

                {/* Application Status - Color-coded based on status value */}
                <td className="border-b p-1 text-xs">
                  <span
                    className={`cursor-pointer rounded px-2 py-1 font-semibold transition-all duration-300 ease-in-out ${
                      student.applicationStatus.toLocaleLowerCase().includes("pending")
                        ? "bg-success" // Green for pending
                        : student.applicationStatus.toLocaleLowerCase().includes("accepted")
                          ? "bg-accent" // Accent color for accepted
                          : student.applicationStatus.toLocaleLowerCase().includes("denied")
                            ? "bg-danger" // Red for denied
                            : student.applicationStatus.toLocaleLowerCase().includes("invalid")
                              ? "bg-warning" // Yellow for invalid
                              : "bg-container_1" // Default gray for unknown statuses
                    }`}
                  >
                    {student.applicationStatus}
                  </span>
                </td>
                <td>
                  <FontAwesomeIcon 
                    icon={faSquareCheck} 
                    className="text-background ml-2 cursor-pointer text-[20px] transition-all duration-500 ease-in-out hover:text-accent" 
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};