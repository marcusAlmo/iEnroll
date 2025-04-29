import React, { createContext, useState, useEffect, useMemo } from "react";
import mockData from "../pages/enrollment-review/test/mockData.json";

// Constants
export const UNASSIGNED_SECTION_ID = 999;

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
  imageUrl?: string;           // URL to the uploaded document/image for this requirement
  userInput?: string;         // Optional user input field for additional information
  requirementType: string;   // Type of requirement (e.g., "Document", "Input", "Image")
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
  setCurrentIndex: (index: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRequirementStatus: (status: boolean, reason?: string) => void;

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

  isSectionModalOpen: boolean;                // Controls visibility of the section modal
  setIsSectionModalOpen: (isOpen: boolean) => void; // Function to toggle section modal visibility
  
  // Section modal type
  sectionModalType: 'assign' | 'reassign';    // Type of section modal to display
  setSectionModalType: (type: 'assign' | 'reassign') => void; // Function to set section modal type
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
  const [denialReason, setDenialReason] = useState(''); // State to store the denial reason
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false); // State to control section modal visibility
  const [sectionModalType, setSectionModalType] = useState<'assign' | 'reassign'>('reassign'); // Default to reassign modal

  // Function to handle section modal opening with type
  const handleSetSectionModalOpen = (isOpen: boolean) => {
    setIsSectionModalOpen(isOpen);
    if (isOpen) {
      // Only set the modal type if it needs to change
      const newType = selectedSection === UNASSIGNED_SECTION_ID ? 'assign' : 'reassign';
      if (newType !== sectionModalType) {
        setSectionModalType(newType);
      }
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % requirements.length;
      setSelectedRequirement(requirements[newIndex]);
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? requirements.length - 1 : prevIndex - 1;
      setSelectedRequirement(requirements[newIndex]);
      return newIndex;
    });
  };

  const handleOpenDenialReson = () => {
    setIsDenied(true);
  }

  const handleRequirementStatus = (status: boolean, reason?: string) => {
    if (!selectedRequirement) return;
  
    // Create a copy of requirements
    const updatedRequirements = requirements.map((req) =>
      req.requirementName === selectedRequirement.requirementName
        ? { ...req, requirementStatus: status, denialReason: reason || "" }
        : req
    );
  
    // Update the requirements in the selected student
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        requirements: updatedRequirements,
      });
    }
  
    // Update the state
    setRequirements((prevRequirements) =>
      prevRequirements.map((req) =>
        req.requirementName === selectedRequirement.requirementName
          ? { ...req, requirementStatus: status, denialReason: reason || "" }
          : req
      )
    );
  
    // Move to the next requirement
    handleNext();
  
    // Reset the selected requirement based on the new index
    setSelectedRequirement(updatedRequirements[currentIndex]);
  
    // Reset denial state
    setIsDenied(false);
  
    console.log("Updated requirement:", updatedRequirements[currentIndex]);
  };

  useEffect(() => {
    console.log("Modal Opened with Selected Requirement:", selectedRequirement);
  }, [selectedRequirement]);
  
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

  useEffect(() => {
    if (selectedRequirement && requirements.length > 0) {
      const newIndex = requirements.findIndex(
        (req) => req.requirementName === selectedRequirement.requirementName
      );
      setCurrentIndex(newIndex);
    }
  }, [selectedRequirement, requirements]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Only recalculates when any of the dependency values change
   */
  const value = useMemo(
    () => ({
      activeItem,
      setActiveItem,
      currentIndex,
      setCurrentIndex,
      handleNext,
      handlePrevious,
      handleRequirementStatus,
      handleOpenDenialReson,
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
      setIsDenied,
      denialReason,
      setDenialReason,
      isSectionModalOpen,
      setIsSectionModalOpen: handleSetSectionModalOpen,
      sectionModalType,
      setSectionModalType,
    }),
    [
      activeItem,
      currentIndex,
      denialReason,
      handleNext,
      handlePrevious,
      handleRequirementStatus,
      handleSetSectionModalOpen,
      isDenied,
      gradeLevels,
      selectedGradeLevel,
      sections,
      selectedSection,
      students,
      selectedStudent,
      requirements,
      selectedRequirement,
      isModalOpen,
      isSectionModalOpen,
      sectionModalType,
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