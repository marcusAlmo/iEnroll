import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";

const EnrollmentPage = () => {
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
    <div>
      <h1>Enrollment Review</h1>

      {/* Grade Level Selection */}
      <div>
        <h2>Select Grade Level</h2>
        <select
          value={selectedGradeLevel || ""}
          onChange={(e) => setSelectedGradeLevel(Number(e.target.value))}
        >
          <option value="">-- Select Grade Level --</option>
          {gradeLevels.map((level) => (
            <option key={level.gradeId} value={level.gradeId}>
              {level.gradeName}
            </option>
          ))}
        </select>
      </div>

      {/* Section Selection */}
      {selectedGradeLevel && (
        <div>
          <h2>Select Section</h2>
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(Number(e.target.value))}
          >
            <option value="">-- Select Section --</option>
            {sections.map((section) => (
              <option key={section.sectionId} value={section.sectionId}>
                {section.sectionName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Student List */}
      {selectedSection && (
        <div>
          <h2>Students in Section</h2>
          <ul>
            {students.map((student) => (
              <li
                key={student.studentId}
                onClick={() => setSelectedStudent(student)}
              >
                {student.studentName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements List */}
      {selectedStudent && (
        <div>
          <h2>Requirements for {selectedStudent.studentName}</h2>
          <ul>
            {requirements.map((req, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedRequirement(req); // Select requirement
                  setIsModalOpen(true); // Open modal
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: selectedRequirement === req ? "bold" : "normal",
                }}
              >
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedRequirement && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h3>{selectedRequirement}</h3>
            {selectedStudent && (
              <div>
                <p>
                  <strong>First Name:</strong> {selectedStudent.f_name}
                </p>
                <p>
                  <strong>Middle Name:</strong> {selectedStudent.m_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {selectedStudent.l_name}
                </p>
              </div>
            )}
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentPage;
