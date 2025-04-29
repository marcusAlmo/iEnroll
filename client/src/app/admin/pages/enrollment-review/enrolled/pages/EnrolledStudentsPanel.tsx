import React from 'react';
import { useEnrolledStudents } from '../../../../context/enrolledStudentsContext';
import PrintButton from './PrintButton';

/**
 * EnrolledStudentsPanel Component
 * 
 * This component displays a list of enrolled students with filters for grade levels and sections.
 * It allows users to view and filter enrolled students based on their grade level and section.
 */
const EnrolledStudentsPanel: React.FC = () => {
  // Extract required state and functions from the EnrolledStudents context
  const {
    gradeLevels,
    selectedGradeLevel,
    sections,
    selectedSection,
    students,
    selectedStudent,
    setSelectedStudent,
    searchTerm,
    setSearchTerm,
  } = useEnrolledStudents();
  
  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toString().includes(searchTerm)
  );

  // Get the grade level name for the selected grade level
  const getGradeLevelName = () => {
    if (!selectedGradeLevel) return 'All Grade Levels';
    const gradeLevel = gradeLevels.find(level => level.gradeId === selectedGradeLevel);
    return gradeLevel ? gradeLevel.gradeName : 'All Grade Levels';
  };

  // Get the section name for the selected section
  const getSectionName = () => {
    if (!selectedSection) return 'All Sections';
    const section = sections.find(section => section.sectionId === selectedSection);
    return section ? section.sectionName : 'All Sections';
  };

  return (
    <div className="border-text-2 flex-1 h-[530px] rounded-[10px] rounded-l border bg-background p-3 shadow-md overflow-y-auto">
      {/* Panel Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-left text-sm font-bold text-text-2">ENROLLED STUDENTS</h3>
        </div>
        <div className="text-xs text-text-2 flex items-center gap-2">
          <PrintButton /> :

          <div className="px-10 py-[8px] rounded-[10px] bg-accent/40 text-primary text-sm">
            {getGradeLevelName()} {selectedSection && `- ${getSectionName()}`}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="w-full p-2 border border-text-2 rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students List */}
      <div className="flex w-full flex-col text-sm">
        {filteredStudents.length > 0 ? (
          <ul className="w-full">
            {filteredStudents.map((student) => (
              <li
                key={student.studentId}
                className={`w-full cursor-pointer rounded-[10px] py-2 px-3 mb-2 font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:mx-10 hover:bg-accent/50 ${
                  selectedStudent?.studentId === student.studentId ? "bg-accent" : "bg-background border border-text-2"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{student.studentName}</div>
                    <div className="text-xs text-text-2">ID: {student.studentId}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    student.applicationStatus === 'Enrolled' ? 'bg-green-100 text-green-800' : 
                    student.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.applicationStatus}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-text-2 py-4">
            {searchTerm 
              ? 'No students found matching your search.' 
              : 'Select a grade level and section to view enrolled students, or use the search bar to find students.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPanel;
