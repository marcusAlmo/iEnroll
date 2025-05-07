import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveOrDenyRequirement,
  getAllGradeLevels,
  getAllRequirementsByStudentId,
  getAllSectionsByGradeLevel,
  getAllStudentsAssignedBySection,
  getAllStudentsUnassignedByGradeSectionProgram,
  updateEnrollmentStatus,
} from "@/services/desktop-web-app/enrollment-review/assigned";
import Enums, {
  application_status,
  attachment_status,
  attachment_type,
} from "@/services/common/types/enums";
import { EnrollmentReviewContext } from "./EnrollmentReviewContext.1";
import { EnrollmentStatus } from "@/services/desktop-web-app/enrollment-review/assigned/types";

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
  gradeSectionProgramId: number | number[];
  _unassigned?: boolean; // Display unassigned section (e.g., "Unassigned")
}

/**
 * Represents an enrollment requirement for a student
 */
interface Requirement {
  applicationId: number;
  requirementId: number;
  requirementName: string; // Name of the requirement (e.g., "Birth Certificate")
  requirementStatus: attachment_status;
  imageUrl?: string; // URL to the uploaded document/image for this requirement
  fileUrl?: string | null; // URL to the uploaded document/image for this requirement
  fileName: string | null;
  userInput?: string; // Optional user input field for additional information
  requirementType: attachment_type; // Type of requirement (e.g., "Document", "Input", "Image")
}

/**
 * Represents a student in the enrollment system
 */
interface Student {
  studentId: number; // Unique identifier for the student
  studentName: string; // Full name of the student (for display purposes)
  firstName: string; // Student's first name
  middleName: string | null; // Student's middle name
  suffix: string | null; // Student's suffix (e.g., "Jr.", "Sr.")
  lastName: string; // Student's last name
  applicationStatus: application_status; // Current status of the enrollment application
}

/**
 * Props for the EnrollmentReviewContext
 * Defines all state variables and setter functions available in the context
 */
export interface EnrollmentReviewContextProps {
  // Navigation state
  activeItem: string;
  setActiveItem: (item: string) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRequirementStatus: (status: boolean, reason?: string) => void;

  // Grade level state
  gradeLevels: GradeLevel[] | undefined;
  selectedGradeLevel: number | null;
  setSelectedGradeLevel: (gradeId: number | null) => void;
  isGradeLevelPending: boolean;

  // Section state
  sections: Section[] | undefined;
  selectedSection: Section | null;
  setSelectedSection: (section: Section | null) => void;
  isSectionsPending: boolean;

  // Student state
  students: Student[] | undefined;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  isStudentPending: boolean;

  // Requirement state
  requirements: Requirement[] | undefined;
  selectedRequirement: Requirement | null;
  setSelectedRequirement: (requirement: Requirement | null) => void;
  isStudentRequirementPending: boolean;

  // Modal state
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  // Deny state
  isDenied: boolean;
  setIsDenied: (isDenied: boolean) => void;

  isSectionModalOpen: boolean;
  setIsSectionModalOpen: (isOpen: boolean) => void;

  // Section modal type
  sectionModalType: "assign" | "reassign";
  setSectionModalType: (type: "assign" | "reassign") => void;
}

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
  const queryClient = useQueryClient();

  // State Management
  const [activeItem, setActiveItem] = useState("gradeLevels");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDenied, setIsDenied] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionModalType, setSectionModalType] = useState<
    "assign" | "reassign"
  >("reassign");

  // Queries
  const { data: gradeLevels, isPending: isGradeLevelPending } = useQuery({
    queryKey: ["assignedGradeLevels"],
    queryFn: getAllGradeLevels,
    select: (data): GradeLevel[] =>
      data.data.map((grade: { gradeId: number; gradeName: string }) => ({
        gradeId: grade.gradeId,
        gradeName: grade.gradeName,
      })),
  });

  const { data: sections, isPending: isSectionsPending } = useQuery({
    queryKey: ["enrolledSections", selectedGradeLevel],
    queryFn: () => getAllSectionsByGradeLevel(selectedGradeLevel!),
    select: (data): Section[] => {
      const raw = data.data;
      const gradeSectionPrograms = new Set<number>();

      const result: Section[] = raw.map((section) => {
        gradeSectionPrograms.add(section.gradeSectionProgramId);
        return {
          sectionId: section.sectionId,
          sectionName: `${section.programName} | ${section.sectionName}`,
          gradeSectionProgramId: section.gradeSectionProgramId,
        };
      });

      const unassignedSections: Section[] = [...gradeSectionPrograms].map(
        (programId) => {
          const program = raw.find(
            (r) => r.gradeSectionProgramId === programId,
          );

          return {
            sectionId: -programId, // Use a negative or unique identifier to prevent conflict
            sectionName: `${program?.programName} | Unassigned`,
            gradeSectionProgramId: programId,
            _unassigned: true,
          };
        },
      );

      return [...result, ...unassignedSections];
    },

    enabled: selectedGradeLevel !== null,
  });

  const { data: students, isPending: isStudentPending } = useQuery({
    queryKey: [
      "enrolledStudents",
      selectedSection?.sectionId,
      selectedSection?._unassigned,
    ],
    queryFn: () =>
      selectedSection?._unassigned
        ? getAllStudentsUnassignedByGradeSectionProgram(
            selectedSection!.gradeSectionProgramId as number[],
          )
        : getAllStudentsAssignedBySection(selectedSection!.sectionId),
    select: (data): Student[] =>
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
        suffix: student.suffix,
        lastName: student.lastName,
        applicationStatus: student.enrollmentStatus,
      })),
    enabled: selectedSection?.sectionId !== null,
  });

  const { data: requirements, isPending: isRequirementsPending } = useQuery({
    queryKey: ["enrolledRequirements", selectedStudent?.studentId],
    queryFn: () => getAllRequirementsByStudentId(selectedStudent!.studentId),
    select: (data): Requirement[] =>
      data.data.map((requirement) => ({
        applicationId: requirement.applicationId,
        requirementId: requirement.requirementId,
        requirementName: requirement.requirementName,
        requirementStatus: requirement.requirementStatus,
        imageUrl: requirement.fileUrl ?? undefined,
        userInput: requirement.userInput ?? undefined,
        requirementType: requirement.requirementType,
        fileName: requirement.fileName ?? null,
      })),
    enabled: Boolean(selectedStudent?.studentId),
  });

  // Mutations
  const { mutate: mutateUpdateEnrollmentStatus } = useMutation({
    mutationKey: ["assignedUpdateEnrollmentStatus", selectedStudent?.studentId],
    mutationFn: updateEnrollmentStatus,
    onSuccess: () => {
      console.log("Update enroll success.");
      queryClient.invalidateQueries({
        queryKey: [
          "enrolledStudents",
          selectedSection?.sectionId,
          selectedSection?._unassigned,
        ],
      });
    },
    onError: (error) => {
      console.log("UPDATE_ENROLLMENT_ERROR", error);
    },
  });

  const { mutate: mutateApproveOrDenyRequirement } = useMutation({
    mutationKey: [
      "assignedApproveOrDenyDocument",
      selectedRequirement?.applicationId,
      selectedRequirement?.requirementId,
    ],
    mutationFn: approveOrDenyRequirement,
    onSuccess: () => {
      console.log("Approve or deny success");
      handleNext();
      queryClient.invalidateQueries({
        queryKey: ["enrolledRequirements", selectedStudent?.studentId],
      });
      setIsDenied(false);
    },
    onError: (error) => {
      console.log("APPROVE_OR_DENY_ERROR", error);
    },
  });

  // Effects
  useEffect(() => {
    if (!isGradeLevelPending && gradeLevels?.length) {
      setSelectedGradeLevel(gradeLevels[0].gradeId);
    }
  }, [isGradeLevelPending, gradeLevels]);

  useEffect(() => {
    if (!isSectionsPending && sections?.length) {
      setSelectedSection(sections[0]);
    }
  }, [isSectionsPending, sections]);

  useEffect(() => {
    if (!isStudentPending && students?.length) {
      setSelectedStudent(students[0]);
    }
  }, [isStudentPending, students]);

  useEffect(() => {
    if (!isRequirementsPending && requirements?.length) {
      setSelectedRequirement(requirements[0]);
    }
  }, [isRequirementsPending, requirements]);

  useEffect(() => {
    if (selectedStudent && !isRequirementsPending && requirements?.length) {
      let accepted = 0;
      let pending = 0;

      for (const requirement of requirements) {
        if (
          requirement.requirementStatus === Enums.attachment_status.accepted
        ) {
          accepted++;
        } else if (
          requirement.requirementStatus === Enums.attachment_status.pending
        ) {
          pending++;
        }
      }

      const total = requirements.length;

      if (pending === total) return;

      if (accepted === total) {
        mutateUpdateEnrollmentStatus({
          status: EnrollmentStatus.ACCEPTED,
          studentId: selectedStudent.studentId,
        });
        return;
      }

      if (accepted === 0 && pending === 0) {
        mutateUpdateEnrollmentStatus({
          status: EnrollmentStatus.DENIED,
          studentId: selectedStudent.studentId,
        });
        return;
      }

      mutateUpdateEnrollmentStatus({
        status: EnrollmentStatus.INVALID,
        studentId: selectedStudent.studentId,
      });
    }
  }, [
    isRequirementsPending,
    mutateUpdateEnrollmentStatus,
    requirements,
    selectedStudent,
  ]);

  useEffect(() => {
    console.log("Modal Opened with Selected Requirement:", selectedRequirement);
  }, [selectedRequirement]);

  // Handlers
  const handleSetSectionModalOpen = useCallback(
    (isOpen: boolean) => {
      setIsSectionModalOpen(isOpen);
      if (isOpen) {
        const newType = selectedSection?._unassigned ? "assign" : "reassign";
        if (newType !== sectionModalType) {
          setSectionModalType(newType);
        }
      }
    },
    [sectionModalType, selectedSection],
  );

  const handleNext = useCallback(() => {
    if (requirements)
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % requirements.length;
        setSelectedRequirement(requirements[newIndex]);
        return newIndex;
      });
  }, [requirements]);

  const handlePrevious = useCallback(() => {
    if (requirements)
      setCurrentIndex((prevIndex) => {
        const newIndex =
          prevIndex === 0 ? requirements.length - 1 : prevIndex - 1;
        setSelectedRequirement(requirements[newIndex]);
        return newIndex;
      });
  }, [requirements]);

  const handleRequirementStatus = useCallback(
    (status: boolean, reason?: string) => {
      if (!selectedRequirement) return;

      mutateApproveOrDenyRequirement({
        applicationId: selectedRequirement.applicationId,
        requirementId: selectedRequirement.requirementId,
        action: status ? "approve" : "deny",
        remarks: reason,
      });
    },
    [mutateApproveOrDenyRequirement, selectedRequirement],
  );

  // Memoized Context Value
  const value = useMemo(
    () => ({
      activeItem,
      setActiveItem,
      currentIndex,
      setCurrentIndex,
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
      setIsDenied,
      denialReason,
      setDenialReason,
      isSectionModalOpen,
      setIsSectionModalOpen: handleSetSectionModalOpen,
      sectionModalType,
      setSectionModalType,
      isGradeLevelPending,
      isSectionsPending,
      isStudentPending,
      isStudentRequirementPending: isRequirementsPending,
    }),
    [
      activeItem,
      currentIndex,
      handleNext,
      handlePrevious,
      handleRequirementStatus,
      gradeLevels,
      selectedGradeLevel,
      sections,
      selectedSection,
      students,
      selectedStudent,
      requirements,
      selectedRequirement,
      isModalOpen,
      isDenied,
      denialReason,
      isSectionModalOpen,
      handleSetSectionModalOpen,
      sectionModalType,
      isGradeLevelPending,
      isSectionsPending,
      isStudentPending,
      isRequirementsPending,
    ],
  );

  return (
    <EnrollmentReviewContext.Provider value={value}>
      {children}
    </EnrollmentReviewContext.Provider>
  );
};
