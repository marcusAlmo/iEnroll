import React from 'react'
import { useEnrollmentReview } from '../../../../context/enrollmentReviewContext'

export const StudentsPanel:React.FC = () => {

  const {
      selectedSection,          // Currently selected section ID
      students,                 // List of students in the selected section
      selectedStudent,          // Currently selected student object
      setSelectedStudent,       // Function to update the selected student

    } = useEnrollmentReview();

  return (
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
          <tbody className="text-sm text-left ">
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
  )
}
