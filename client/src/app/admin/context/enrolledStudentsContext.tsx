import React, { createContext, useState, useEffect, useMemo } from "react";
import enrolledStudentsData from "../pages/enrollment-review/test/enrolledStudentsData.json";

/**
 * Represents a school grade level
 */
interface GradeLevel {
  gradeId: number;      // Unique identifier for the grade
  gradeName: string;    // Display name for the grade (e.g., "Grade 1", "Kindergarten")
}

/**
 * Represents a section within a grade level
 */
interface Section {
  sectionId: number;    // Unique identifier for the section
  sectionName: string;  // Display name for the section (e.g., "Section A")
}

/**
 * Represents an enrolled student
 */
interface EnrolledStudent {
  studentId: number;          // Unique identifier for the student
  studentName: string;        // Full name of the student (for display purposes)
  firstName: string;          // Student's first name
  middleName: string;         // Student's middle name
  lastName: string;           // Student's last name
  applicationStatus: string;  // Current status of the student (e.g., "Enrolled")
  enrollmentDate: string;     // Date when the student was enrolled
  gradeLevel: number;         // Grade level ID of the student
  section: number;            // Section ID of the student
}

/**
 * Props for the EnrolledStudentsContext
 * Defines all state variables and setter functions available in the context
 */
interface EnrolledStudentsContextProps {
  // Grade level state
  gradeLevels: GradeLevel[];                  // Available grade levels
  selectedGradeLevel: number | null;          // Currently selected grade level ID
  setSelectedGradeLevel: (gradeId: number | null) => void; // Function to update selected grade level

  // Section state
  sections: Section[];                        // Available sections for the selected grade
  selectedSection: number | null;             // Currently selected section ID
  setSelectedSection: (sectionId: number | null) => void; // Function to update selected section

  // Student state
  students: EnrolledStudent[];                // Available students for the selected section
  selectedStudent: EnrolledStudent | null;    // Currently selected student
  setSelectedStudent: (student: EnrolledStudent | null) => void; // Function to update selected student

  // Search state
  searchTerm: string;                         // Search term for filtering students
  setSearchTerm: (term: string) => void;      // Function to update search term
}

// Create the context with undefined default value
const EnrolledStudentsContext = createContext<
  EnrolledStudentsContextProps | undefined
>(undefined);

/**
 * Provider component for the EnrolledStudents context
 * 
 * This component manages the state for the enrolled students and provides
 * access to that state via context to all child components.
 * 
 * @param children - React child components that will have access to this context
 */
export const EnrolledStudentsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // State Management
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<EnrolledStudent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Load grade levels from mock data when component mounts.
   * please replace later with actual grade levels from the database
   */
  useEffect(() => {
    setGradeLevels(enrolledStudentsData.gradeLevels);
  }, []);

  /**
   * Update sections when a grade level is selected
   * Reset section selection, students list when grade level changes
   */
  useEffect(() => {
    if (selectedGradeLevel !== null) {
      const gradeKey = selectedGradeLevel.toString();
      const fetchedSections =
        enrolledStudentsData.sections[gradeKey as keyof typeof enrolledStudentsData.sections] || [];
      setSections(fetchedSections);
      setSelectedSection(null); // Reset selected section
      setStudents([]); // Reset students
    } else {
      setSections([]);
    }
  }, [selectedGradeLevel]);

  /**
   * Update students when a section is selected
   * Reset student selection when section changes
   */
  useEffect(() => {
    if (selectedSection !== null) {
      const sectionKey = selectedSection.toString();
      const fetchedStudents =
        enrolledStudentsData.students[sectionKey as keyof typeof enrolledStudentsData.students] || [];
      setStudents(fetchedStudents);
      setSelectedStudent(null); // Reset selected student
    } else if (selectedGradeLevel !== null) {
      // If a grade level is selected but no section, get all students from that grade level
      const allStudents = Object.values(enrolledStudentsData.students)
        .flat()
        .filter(student => student.gradeLevel === selectedGradeLevel);
      setStudents(allStudents);
      setSelectedStudent(null);
    } else {
      // If no grade level or section is selected, get all students
      const allStudents = Object.values(enrolledStudentsData.students).flat();
      setStudents(allStudents);
    }
  }, [selectedSection, selectedGradeLevel]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Only recalculates when any of the dependency values change
   */
  const value = useMemo(
    () => ({
      gradeLevels,
      selectedGradeLevel,
      setSelectedGradeLevel,
      sections,
      selectedSection,
      setSelectedSection,
      students,
      selectedStudent,
      setSelectedStudent,
      searchTerm,
      setSearchTerm,
    }),
    [
      gradeLevels,
      selectedGradeLevel,
      sections,
      selectedSection,
      students,
      selectedStudent,
      searchTerm,
    ]
  );

  return (
    <EnrolledStudentsContext.Provider value={value}>
      {children}
    </EnrolledStudentsContext.Provider>
  );
};

/**
 * Custom hook to use the EnrolledStudents context
 * 
 * This hook provides a convenient way to access the context in components
 * and includes error handling to ensure it's used correctly.
 * 
 * @returns The EnrolledStudents context value
 * @throws Error if used outside of EnrolledStudentsProvider
 */
export function useEnrolledStudents() {
  const context = React.useContext(EnrolledStudentsContext);
  if (!context) {
    throw new Error(
      "useEnrolledStudents must be used within an EnrolledStudentsProvider"
    );
  }
  return context;
} 