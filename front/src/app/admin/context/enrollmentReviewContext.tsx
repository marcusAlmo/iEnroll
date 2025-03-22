import React, { createContext, useState, useEffect, useMemo } from "react";
import mockData from "../pages/enrollment-review/test/mockData.json";

// Define Interfaces
interface GradeLevel {
  gradeId: number;
  gradeName: string;
}

interface Section {
  sectionId: number;
  sectionName: string;
}

interface Student {
  studentId: number;
  studentName: string;
  firstName:  string;
  middleName: string;
  lastName: string;
  applicationStatus: string[];
}

interface EnrollmentReviewContextProps {
  activeItem: string;
  setActiveItem: (item: string) => void;

  gradeLevels: GradeLevel[];
  selectedGradeLevel: number | null;
  setSelectedGradeLevel: (gradeId: number | null) => void;

  sections: Section[];
  selectedSection: number | null;
  setSelectedSection: (sectionId: number | null) => void;

  students: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;

  requirements: string[];
  selectedRequirement: string | null;
  setSelectedRequirement: (requirement: string | null) => void;

  isModalOpen: boolean; 
  setIsModalOpen: (isOpen: boolean) => void;
}

const EnrollmentReviewContext = createContext<
  EnrollmentReviewContextProps | undefined
>(undefined);

export const EnrollmentReviewProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // State Management
  const [activeItem, setActiveItem] = useState("gradeLevels");
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(
    null
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(
    null
  ); // State for selected requirement
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Grade Levels
  useEffect(() => {
    setGradeLevels(mockData.gradeLevels);
  }, []);

  // Fetch Sections when a Grade Level is Selected
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

  // Fetch Students when a Section is Selected
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

  // Fetch Requirements when a Student is Selected
  useEffect(() => {
    if (selectedStudent) {
      setRequirements(selectedStudent.applicationStatus);
    } else {
      setRequirements([]);
    }
  }, [selectedStudent]);

  // Memoized Value for Context
  const value = useMemo(
    () => ({
      activeItem,
      setActiveItem,
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
    }),
    [
      activeItem,
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

export const useEnrollmentReview = () => {
  const context = React.useContext(EnrollmentReviewContext);
  if (!context) {
    throw new Error(
      "useEnrollmentReview must be used within an EnrollmentReviewProvider"
    );
  }
  return context;
};
