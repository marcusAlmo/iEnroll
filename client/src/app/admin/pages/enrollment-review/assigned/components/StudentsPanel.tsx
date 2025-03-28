import React from 'react';
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext';

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
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 w-[600px] h-[530px] border bg-background p-2 shadow-md overflow-y-scroll">
      {/* Student Table */}
      <table className="table-auto w-full border-collapse">
        {/* Table Header */}
        <thead className="text-text-2 text-left">
          <tr>
            <th className="">#</th>                  {/* Column for student number */}
            <th className="pl-1">STUDENT</th>        {/* Column for student names */}
            <th className="pl-1">STATUS</th>         {/* Column for application status */}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="text-sm text-left">
          {/* Student Rows - Only shown if a section is selected */}
          {selectedSection &&
            students.map((student, index) => (
              <tr
                key={student.studentId} // Unique identifier for each student
                className={`cursor-pointer hover:bg-accent/50 rounded-[10px] ${
                  selectedStudent?.studentId === student.studentId
                    ? "bg-accent" // Highlight the selected student
                    : ""
                }`}
                onClick={() => setSelectedStudent(student)} // Update the selected student on click
              >
                {/* Student Number */}
                <td className="border-b text-center">{index + 1}</td>

                {/* Student Name - Formatted as LASTNAME, FirstName MiddleName */}
                <td className="border-b p-1">
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
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};