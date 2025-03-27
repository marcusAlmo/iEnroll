import React, { createContext, useState, useEffect, useMemo } from "react";
import mockData from "../pages/enrollment-review/test/mockData.json";

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
 * Represents an enrollment requirement for a student
 */
interface Requirement {
  requirementName: string;    // Name of the requirement (e.g., "Birth Certificate")
  requirementStatus: boolean; // Requirement Status if approved or denied
  imageUrl: string;           // URL to the uploaded document/image for this requirement
}

/**
 * Represents a student in the enrollment system
 */
interface Student {
  studentId: number;          // Unique identifier for the student
  studentName: string;        // Full name of the student (for display purposes)
  firstName: string;          // Student's first name
  middleName: string;         // Student's middle name
  lastName: string;           // Student's last name
  applicationStatus: string;  // Current status of the enrollment application
  requirements: Requirement[]; // List of enrollment requirements for this student
}

/**
 * Props for the EnrollmentReviewContext
 * Defines all state variables and setter functions available in the context
 */
interface EnrollmentReviewContextProps {
  // Navigation state
  activeItem: string;                         // Currently active navigation item
  setActiveItem: (item: string) => void;      // Function to update active navigation item
  currentIndex: number;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRequirementStatus: (status: boolean) => void;

  // Grade level state
  gradeLevels: GradeLevel[];                  // Available grade levels
  selectedGradeLevel: number | null;          // Currently selected grade level ID
  setSelectedGradeLevel: (gradeId: number | null) => void; // Function to update selected grade level

  // Section state
  sections: Section[];                        // Available sections for the selected grade
  selectedSection: number | null;             // Currently selected section ID
  setSelectedSection: (sectionId: number | null) => void; // Function to update selected section

  // Student state
  students: Student[];                        // Available students for the selected section
  selectedStudent: Student | null;            // Currently selected student
  setSelectedStudent: (student: Student | null) => void; // Function to update selected student

  // Requirement state
  requirements: Requirement[];                // Requirements for the selected student
  selectedRequirement: Requirement | null;    // Currently selected requirement
  setSelectedRequirement: (requirement: Requirement | null) => void; // Function to update selected requirement

  // Modal state
  isModalOpen: boolean;                       // Controls visibility of the modal
  setIsModalOpen: (isOpen: boolean) => void;  // Function to toggle modal visibility

  // Deny state
  isDenied: boolean;                          // Controls visibility of the deny text field
  setIsDenied: (isDenied: boolean) => void;    // Function to toggle deny text field visibility
}

// Create the context with undefined default value
const EnrollmentReviewContext = createContext<
  EnrollmentReviewContextProps | undefined
>(undefined);

/**
 * Provider component for the EnrollmentReview context
 * 
 * This component manages the state for the enrollment review process and provides
 * access to that state via context to all child components.
 * 
 * @param children - React child components that will have access to this context
 */
export const EnrollmentReviewProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // State Management
  const [activeItem, setActiveItem] = useState("gradeLevels"); // Default active item is grade levels
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDenied, setIsDenied] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % requirements.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? requirements.length - 1 : prevIndex - 1
    );
  };

  const handleRequirementStatus = (status: boolean) => {
    if (selectedRequirement) {
      setSelectedRequirement({
        ...selectedRequirement,
        requirementStatus: status,
      });
    }

    console.log("Requirement status updated:", status);
  }

  /**
   * Load grade levels from mock data when component mounts
   */
  useEffect(() => {
    setGradeLevels(mockData.gradeLevels);
  }, []);

  /**
   * Update sections when a grade level is selected
   * Reset section selection, students list when grade level changes
   */
  useEffect(() => {
    if (selectedGradeLevel) {
      const gradeKey = selectedGradeLevel.toString();
      const fetchedSections =
        mockData.sections[gradeKey as keyof typeof mockData.sections] || [];
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
    if (selectedSection) {
      const sectionKey = selectedSection.toString();
      const fetchedStudents =
        mockData.students[sectionKey as keyof typeof mockData.students] || [];
      setStudents(fetchedStudents);
      setSelectedStudent(null); // Reset selected student
    } else {
      setStudents([]);
    }
  }, [selectedSection]);

  /**
   * Update requirements when a student is selected
   */
  useEffect(() => {
    if (selectedStudent) {
      setRequirements(selectedStudent.requirements);
    } else {
      setRequirements([]);
    }
  }, [selectedStudent]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Only recalculates when any of the dependency values change
   */
  const value = useMemo(
    () => ({
      activeItem,
      setActiveItem,
      currentIndex,
      handleNext,
      handlePrevious,
      handleRequirementStatus,
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
      isDenied,
      setIsDenied
    }),
    [
      activeItem,
      currentIndex,
      gradeLevels,
      selectedGradeLevel,
      sections,
      selectedSection,
      students,
      selectedStudent,
      requirements,
      selectedRequirement,
      isModalOpen,
    ]
  );

  return (
    <EnrollmentReviewContext.Provider value={value}>
      {children}
    </EnrollmentReviewContext.Provider>
  );
};

/**
 * Custom hook to use the EnrollmentReview context
 * 
 * This hook provides a convenient way to access the context in components
 * and includes error handling to ensure it's used correctly.
 * 
 * @returns The EnrollmentReview context value
 * @throws Error if used outside of EnrollmentReviewProvider
 */
export const useEnrollmentReview = () => {
  const context = React.useContext(EnrollmentReviewContext);
  if (!context) {
    throw new Error(
      "useEnrollmentReview must be used within an EnrollmentReviewProvider"
    );
  }
  return context;
};