import {
  getAllGradeLevels,
  getAllSectionsByGradeLevel,
  getAllStudentsEnrolledBySection,
} from "@/services/desktop-web-app/enrollment-review/enrolled";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";
import { EnrolledStudentsContext } from "./EnrolledStudentsContext.1";
// import enrolledStudentsData from "../pages/enrollment-review/test/enrolledStudentsData.json";

/**
 * Represents a school grade level
 */
interface GradeLevel {
  gradeId: number; // Unique identifier for the grade
  gradeName: string; // Display name for the grade (e.g., "Grade 1", "Kindergarten")
}

/**
 * Represents a section within a grade level
 */
interface Section {
  sectionId: number; // Unique identifier for the section
  sectionName: string; // Display name for the section (e.g., "Section A")
}

/**
 * Represents an enrolled student
 */
interface EnrolledStudent {
  studentId: number; // Unique identifier for the student
  studentName: string; // Full name of the student (for display purposes)
  firstName: string; // Student's first name
  middleName: string | null; // Student's middle name
  lastName: string; // Student's last name
  suffix: string | null; // Student's suffix (e.g., "Jr.", "III")
  applicationStatus: string; // Current status of the student (e.g., "Enrolled")
  enrollmentDate: string; // Date when the student was enrolled
  gradeLevel: string; // Grade level of the student
  section: string; // Section of the student
}

/**
 * Props for the EnrolledStudentsContext
 * Defines all state variables and setter functions available in the context
 */
export interface EnrolledStudentsContextProps {
  // Grade level state
  gradeLevels: GradeLevel[] | undefined; // Available grade levels
  isGradeLevelPending: boolean; // Loading state for grade levels
  selectedGradeLevel: number | null; // Currently selected grade level ID
  setSelectedGradeLevel: (gradeId: number | null) => void; // Function to update selected grade level

  // Section state
  sections: Section[] | undefined; // Available sections for the selected grade
  isSectionsPending: boolean; // Loading state for sections
  selectedSection: number | null; // Currently selected section ID
  setSelectedSection: (sectionId: number | null) => void; // Function to update selected section

  // Student state
  students: EnrolledStudent[] | undefined; // Available students for the selected section
  isStudentsPending: boolean; // Loading state for students
  selectedStudent: EnrolledStudent | null; // Currently selected student
  setSelectedStudent: (student: EnrolledStudent | null) => void; // Function to update selected student
  refetchStudents: () => Promise<unknown>; // Function to refetch students
  isStudentsRefetching: boolean; // Refetching state for students

  // Search state
  searchTerm: string; // Search term for filtering students
  setSearchTerm: (term: string) => void; // Function to update search term
}

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

  const { data: gradeLevels, isPending: isGradeLevelPending } = useQuery({
    queryKey: ["enrolledGradeLevels"],
    queryFn: getAllGradeLevels,
    select: (data) => data.data,
  });

  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!isGradeLevelPending && gradeLevels?.length) {
      setSelectedGradeLevel(gradeLevels[0].gradeId);
    }
  }, [isGradeLevelPending, gradeLevels]);

  const { data: sections, isPending: isSectionsPending } = useQuery({
    queryKey: ["enrolledSections", selectedGradeLevel],
    queryFn: () => getAllSectionsByGradeLevel(selectedGradeLevel!),
    select: (data) => data.data,
    enabled: selectedGradeLevel !== null,
  });

  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  useEffect(() => {
    if (!isSectionsPending && sections?.length) {
      setSelectedSection(sections[0].sectionId);
    }
  }, [isSectionsPending, sections]);

  const toEnrolledStudents = (students: EnrolledStudent[]) => students;

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: students,
    isPending: isStudentsPending,
    refetch: refetchStudents,
    isRefetching: isStudentsRefetching,
  } = useQuery({
    queryKey: ["enrolledStudents", selectedSection, searchTerm],
    queryFn: () =>
      getAllStudentsEnrolledBySection(
        selectedSection!,
        searchTerm.trim() === "" ? undefined : searchTerm,
      ),
    select: (data) => {
      const raw = data.data;
      return toEnrolledStudents(
        raw.map((student) => ({
          studentId: student.studentId,
          studentName: [
            student.firstName,
            student.middleName,
            student.lastName,
            student.suffix,
          ]
            .filter(Boolean)
            .join(" "),
          firstName: student.firstName,
          middleName: student.middleName,
          lastName: student.lastName,
          suffix: student.suffix,
          applicationStatus: "Enrolled",
          enrollmentDate: student.enrollmentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          gradeLevel: student.gradeLevel,
          section: student.sectionName,
        })),
      );
    },
    enabled: selectedSection !== null,
  });

  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);

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
      isGradeLevelPending,
      isSectionsPending,
      isStudentsPending,
      refetchStudents,
      isStudentsRefetching,
    }),
    [
      gradeLevels,
      selectedGradeLevel,
      sections,
      selectedSection,
      students,
      selectedStudent,
      searchTerm,
      isGradeLevelPending,
      isSectionsPending,
      isStudentsPending,
      refetchStudents,
      isStudentsRefetching,
    ],
  );

  return (
    <EnrolledStudentsContext.Provider value={value}>
      {children}
    </EnrolledStudentsContext.Provider>
  );
};
