import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllGradeLevels,
  getAllSectionsByGradeLevel,
  getAllStudentsEnrolledBySection,
} from "@/services/desktop-web-app/enrollment-review/enrolled";
import { EnrolledStudentsContext } from "./EnrolledStudentsContext.1";

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
  gradeLevels: GradeLevel[] | undefined;
  isGradeLevelPending: boolean;
  selectedGradeLevel: number | null;
  setSelectedGradeLevel: (gradeId: number | null) => void;

  // Section state
  sections: Section[] | undefined;
  isSectionsPending: boolean;
  selectedSection: number | null;
  setSelectedSection: (sectionId: number | null) => void;

  // Student state
  students: EnrolledStudent[] | undefined;
  isStudentsPending: boolean;
  selectedStudent: EnrolledStudent | null;
  setSelectedStudent: (student: EnrolledStudent | null) => void;
  refetchStudents: () => Promise<unknown>;
  isStudentsRefetching: boolean;

  // Search state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
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
  // Grade Level State
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

  // Section State
  const { data: sections, isPending: isSectionsPending } = useQuery({
    queryKey: ["enrolledSections", selectedGradeLevel],
    queryFn: () => getAllSectionsByGradeLevel(selectedGradeLevel!),
    select: (data) => {
      const raw = data.data;
      return raw.map((section) => ({
        ...section,
        sectionName: `${section.programName} | ${section.sectionName}`,
      }));
    },
    enabled: selectedGradeLevel !== null,
  });

  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  useEffect(() => {
    if (!isSectionsPending && sections?.length) {
      setSelectedSection(sections[0].sectionId);
    }
  }, [isSectionsPending, sections]);

  // Student State
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
    select: (data) =>
      data.data.map((student) => ({
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
    enabled: selectedSection !== null,
  });

  const [selectedStudent, setSelectedStudent] =
    useState<EnrolledStudent | null>(null);

  // Memoized Context Value
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
