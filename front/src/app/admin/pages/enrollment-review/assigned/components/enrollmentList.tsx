import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";

const EnrollmentList: React.FC = () => {
  const {
    gradeLevels,
    selectedGradeLevel,
    setSelectedGradeLevel,
    sections,
    selectedSection,
    setSelectedSection,
    students,
    selectedStudent,
    setSelectedStudent,
    requirements,
    selectedRequirement,
    setSelectedRequirement,
    isModalOpen,
    setIsModalOpen,
  } = useEnrollmentReview();

  return (
    <div className="w-full flex flex-row">
      {/* Grade Levels */}
      <div className="border-text-2 w-[210px] h-[530px] rounded-[10px] rounded-r border bg-background p-3 shadow-md overflow-y-scroll">
        {/* Header grade levels */}
        <h3 className="text-left text-sm font-bold text-text-2">GRADE LEVELS</h3>

        {/* Main content for displaying grade levels */}
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

      {/* Section */}
      <div className="border-text-2 w-[210px] h-[530px] border bg-background p-3 shadow-md overflow-y-scroll">
        {/* Header section */}
        <h3 className="text-left text-sm font-bold text-text-2">SECTION</h3>

        {/* Main content for displaying section */}
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

      {/* Students */}
      <div className="border-text-2 w-[600px] h-[530px] border bg-background p-2 shadow-md overflow-y-scroll">
        {/* Header student */}
        <table className="table-auto w-full border-collapse">
          {/* Table header */}
          <thead className="text-text-2 text-left">
            <tr>
              <th className="pl-5">#</th>
              <th className="pl-2">STUDENT</th>
              <th className="pl-2">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-sm text-left">
            {/* Map through the students */}
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
                  <td className="border-b p-1 text-center">{index + 1}</td>
                  <td className="border-b p-1">
                    <span className="font-semibold">
                      {student.lastName.toLocaleUpperCase()}
                    </span>, {student.firstName} {student.middleName}</td>
                    <td className="border-b p-1 text-xs">
                    <span className={`cursor-pointer rounded px-2 py-1 font-semibold transition-all duration-300 ease-in-out ${
                      student.applicationStatus.toLocaleLowerCase().includes("pending")
                      ? "bg-success"
                      : student.applicationStatus.toLocaleLowerCase().includes("accepted")
                      ? "bg-accent"
                      : student.applicationStatus.toLocaleLowerCase().includes("denied")
                      ? "bg-danger"
                      : student.applicationStatus.tpLocaleLowerCase().includes("invalid")
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
    </div>
  );
};

export default EnrollmentList;