import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import Enums from "@/services/common/types/enums";

/**
 * StudentsPanel Component
 *
 * This functional component displays a panel that lists the students available in the selected section.
 * It allows users to select a student, which updates the application state and triggers downstream changes
 * in other panels (e.g., RequirementsPanel).
 *
 * The component relies on the `useEnrollmentReview` context to manage:
 * - The list of students for the selected section.
 * - The currently selected student.
 * - A function to update the selected student.
 */
export const StudentsPanel: React.FC = () => {
  const {
    selectedSection,
    students,
    selectedStudent,
    setSelectedStudent,
    setIsSectionModalOpen,
    isStudentPending,
  } = useEnrollmentReview();

  const isUnassignedSection = selectedSection?._unassigned;

  const handleSectionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSectionModalOpen(true);
  };

  return (
    <div className="border-text-2 bg-background h-[530px] w-[600px] overflow-y-scroll rounded-[10px] rounded-r border px-2 shadow-md">
      {/* Student Table */}
      <table className="w-full table-auto border-collapse">
        <thead className="text-text-2 w-full justify-between text-left">
          <tr>
            <th className="w-1/12 pl-4">#</th>
            <th className="w-8/12 pl-1">STUDENT</th>
            <th className="w-1/12 pl-1">STATUS</th>
            <th className="w-2/12 pl-1">
              <button
                onClick={handleSectionButtonClick}
                className="bg-text-2 text-text button-transition my-1 cursor-pointer rounded-[5px] px-4 py-1 text-xs font-semibold hover:scale-105"
              >
                {isUnassignedSection ? "Assign Section" : "Reassign Section"}
              </button>
            </th>
          </tr>
        </thead>

        <tbody className="w-full text-left text-sm">
          {/* Show loader if data is being fetched */}
          {isStudentPending ? (
            <tr>
              <td colSpan={4} className="text-text-2 py-20 text-center text-sm">
                Loading students...
              </td>
            </tr>
          ) : selectedSection && students?.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-text-2 py-20 text-center text-sm">
                No students in this section.
              </td>
            </tr>
          ) : (
            selectedSection &&
            students?.map((student, index) => (
              <tr
                key={student.studentId}
                className={`hover:bg-accent/50 w-full cursor-pointer rounded-[10px] ${
                  selectedStudent?.studentId === student.studentId
                    ? "bg-accent"
                    : ""
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <td className="w-1/12 border-b text-center">{index + 1}</td>
                <td className="w-8/12 border-b p-3">
                  <span className="font-semibold">
                    {student.lastName.toLocaleUpperCase()}
                  </span>
                  , {student.firstName} {student.middleName}
                </td>
                <td className="w-1/12 border-b p-1 text-xs">
                  <span
                    className={`cursor-pointer rounded px-2 py-1 font-semibold transition-all duration-300 ease-in-out ${
                      student.applicationStatus
                        .toLocaleLowerCase()
                        .includes("pending")
                        ? "bg-accent/20 rounded-full border border-blue-700 px-3 text-blue-700"
                        : student.applicationStatus ===
                            Enums.application_status.accepted
                          ? "bg-success/20 rounded-full border border-green-700 px-3 text-green-700"
                          : student.applicationStatus ===
                              Enums.application_status.denied
                            ? "bg-danger/20 rounded-full border border-red-700 px-3 text-red-700"
                            : student.applicationStatus ===
                                Enums.application_status.invalid
                              ? "bg-warning/20 rounded-full border border-yellow-900 px-3 text-yellow-900"
                              : "bg-container_1"
                    }`}
                  >
                    {student.applicationStatus.charAt(0).toUpperCase() +
                      student.applicationStatus.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="w-2/12">
                  <FontAwesomeIcon
                    icon={faSquareCheck}
                    className="text-background hover:text-accent ml-2 cursor-pointer text-[20px] transition-all duration-500 ease-in-out"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
