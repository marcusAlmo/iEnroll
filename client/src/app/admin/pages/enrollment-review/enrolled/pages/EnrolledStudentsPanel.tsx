import React from "react";
import { useEnrolledStudents } from "@/app/admin/context/useEnrolledStudents";
import PrintButton from "./PrintButton";

/**
 * EnrolledStudentsPanel Component
 *
 * This component displays a list of enrolled students with filters for grade levels and sections.
 * It allows users to view and filter enrolled students based on their grade level and section.
 */
const EnrolledStudentsPanel: React.FC = () => {
  // Extract required state and functions from the EnrolledStudents context
  const {
    selectedGradeLevel,
    gradeLevels,
    selectedSection,
    sections,
    students,
    selectedStudent,
    setSelectedStudent,
    searchTerm,
    setSearchTerm,
    isStudentsPending,
  } = useEnrolledStudents();

  // Filter students based on search term
  // const filteredStudents = students;
  // const filteredStudents = students.filter(student =>
  //   student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   student.studentId.toString().includes(searchTerm)
  // );

  // Get the grade level name for the selected grade level
  const getGradeLevelName = () => {
    if (!selectedGradeLevel) return "All Grade Levels";
    const gradeLevel = gradeLevels?.find(
      (level) => level.gradeId === selectedGradeLevel,
    );
    return gradeLevel ? gradeLevel.gradeName : "All Grade Levels";
  };

  // Get the section name for the selected section
  const getSectionName = () => {
    if (!selectedSection) return "All Sections";
    const section = sections?.find(
      (section) => section.sectionId === selectedSection,
    );
    return section ? section.sectionName : "All Sections";
  };

  return (
    <div className="border-text-2 bg-background h-[530px] flex-1 overflow-y-auto rounded-[10px] rounded-l border p-3 shadow-md">
      {/* Panel Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-text-2 text-left text-sm font-bold">
            ENROLLED STUDENTS
          </h3>
        </div>
        <div className="text-text-2 flex items-center gap-2 text-xs">
          <PrintButton />:
          <div className="bg-accent/40 text-primary rounded-[10px] px-10 py-[8px] text-sm">
            {getGradeLevelName()} {selectedSection && `- ${getSectionName()}`}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="border-text-2 w-full rounded-md border p-2 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students List */}
      <div className="flex w-full flex-col text-sm">
        {isStudentsPending ? (
          <div className="text-text-2 py-4 text-center">Loading...</div>
        ) : !students || students.length === 0 ? (
          <div className="text-text-2 py-4 text-center">
            {searchTerm
              ? "No students found matching your search."
              : "Select a grade level and section to view enrolled students, or use the search bar to find students."}
          </div>
        ) : (
          <ul className="w-full">
            {students.map((student) => (
              <li
                key={student.studentId}
                className={`hover:bg-accent/50 mb-2 w-full cursor-pointer rounded-[10px] px-3 py-2 font-semibold transition-all duration-300 ease-in-out hover:mx-10 hover:scale-105 ${
                  selectedStudent?.studentId === student.studentId
                    ? "bg-accent"
                    : "bg-background border-text-2 border"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{student.studentName}</div>
                    <div className="text-text-2 text-xs">
                      ID: {student.studentId}
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs ${
                      student.applicationStatus === "Enrolled"
                        ? "bg-green-100 text-green-800"
                        : student.applicationStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.applicationStatus}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPanel;
