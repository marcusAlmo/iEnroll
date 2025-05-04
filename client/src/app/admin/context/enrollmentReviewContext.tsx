import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
// import mockData from "../pages/enrollment-review/test/mockData.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveOrDenyRequirement,
  getAllGradeLevels,
  getAllRequirementsByStudentId,
  getAllSectionsByGradeLevel,
  getAllStudentsAssignedBySection,
  getAllStudentsUnassignedByGradeLevel,
} from "@/services/desktop-web-app/enrollment-review/assigned";
import {
  application_status,
  attachment_status,
  attachment_type,
} from "@/services/common/types/enums";

// Constants
export const UNASSIGNED_SECTION_ID = 999;

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
  // requirements: Requirement[]; // List of enrollment requirements for this student
}

/**
 * Props for the EnrollmentReviewContext
 * Defines all state variables and setter functions available in the context
 */
interface EnrollmentReviewContextProps {
  // Navigation state
  activeItem: string; // Currently active navigation item
  setActiveItem: (item: string) => void; // Function to update active navigation item
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleRequirementStatus: (status: boolean, reason?: string) => void;

  // Grade level state
  gradeLevels: GradeLevel[] | undefined; // Available grade levels
  selectedGradeLevel: number | null; // Currently selected grade level ID
  setSelectedGradeLevel: (gradeId: number | null) => void; // Function to update selected grade level
  isGradeLevelPending: boolean; // Loading state for grade levels

  // Section state
  sections: Section[] | undefined; // Available sections for the selected grade
  selectedSection: Section | null; // Currently selected section ID
  setSelectedSection: (section: Section | null) => void; // Function to update selected section
  isSectionsPending: boolean; // Loading state for sections

  // Student state
  students: Student[] | undefined; // Available students for the selected section
  selectedStudent: Student | null; // Currently selected student
  setSelectedStudent: (student: Student | null) => void; // Function to update selected student
  isStudentPending: boolean; // Loading state for students

  // Requirement state
  requirements: Requirement[] | undefined; // Requirements for the selected student
  selectedRequirement: Requirement | null; // Currently selected requirement
  setSelectedRequirement: (requirement: Requirement | null) => void; // Function to update selected requirement
  isStudentRequirementPending: boolean; // Loading state for requirements

  // Modal state
  isModalOpen: boolean; // Controls visibility of the modal
  setIsModalOpen: (isOpen: boolean) => void; // Function to toggle modal visibility

  // Deny state
  isDenied: boolean; // Controls visibility of the deny text field
  setIsDenied: (isDenied: boolean) => void; // Function to toggle deny text field visibility

  isSectionModalOpen: boolean; // Controls visibility of the section modal
  setIsSectionModalOpen: (isOpen: boolean) => void; // Function to toggle section modal visibility

  // Section modal type
  sectionModalType: "assign" | "reassign"; // Type of section modal to display
  setSectionModalType: (type: "assign" | "reassign") => void; // Function to set section modal type
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
  const queryClient = useQueryClient();

  // State Management
  const [activeItem, setActiveItem] = useState("gradeLevels"); // Default active item is grade levels
  // const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);

  const { data: gradeLevels, isPending: isGradeLevelPending } = useQuery({
    queryKey: ["assignedGradeLevels"],
    queryFn: getAllGradeLevels,
    select: (data): GradeLevel[] => {
      const raw = data.data;
      return raw.map((grade: { gradeId: number; gradeName: string }) => ({
        gradeId: grade.gradeId,
        gradeName: grade.gradeName,
      }));
    },
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
    select: (data): Section[] => {
      const raw = data.data;
      const result: Section[] = raw.map(
        (section: { sectionId: number; sectionName: string }) => ({
          sectionId: section.sectionId,
          sectionName: section.sectionName,
        }),
      );

      result.push({
        sectionId: selectedGradeLevel!,
        sectionName: "Unassigned",
        _unassigned: true,
      });

      return result;
    },
    enabled: selectedGradeLevel !== null,
  });

  // const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    if (!isSectionsPending && sections?.length) {
      setSelectedSection(sections[0]);
    }
  }, [isSectionsPending, sections]);

  const { data: students, isPending: isStudentPending } = useQuery({
    queryKey: ["enrolledStudents", selectedSection?.sectionId],
    queryFn: () =>
      selectedSection?._unassigned
        ? getAllStudentsUnassignedByGradeLevel(selectedSection!.sectionId)
        : getAllStudentsAssignedBySection(selectedSection!.sectionId),
    select: (data): Student[] => {
      const raw = data.data;
      return raw.map((student) => ({
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
      }));
    },
    enabled: selectedSection?.sectionId !== null,
  });

  // const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (!isStudentPending && students?.length) {
      setSelectedStudent(students[0]);
    }
  }, [isStudentPending, students]);

  const { data: requirements, isPending: isRequirementsPending } = useQuery({
    queryKey: ["enrolledRequirements", selectedStudent?.studentId],
    queryFn: () => getAllRequirementsByStudentId(selectedStudent!.studentId),
    select: (data): Requirement[] => {
      const raw = data.data;

      return raw.map((requirement) => {
        return {
          applicationId: requirement.applicationId,
          requirementId: requirement.requirementId,
          requirementName: requirement.requirementName,
          requirementStatus: requirement.requirementStatus,
          imageUrl: requirement.fileUrl ?? undefined,
          userInput: requirement.userInput ?? undefined,
          requirementType: requirement.requirementType,
          fileName: requirement.fileName ?? null,
        };
      });
    },
    enabled: Boolean(selectedStudent?.studentId),
  });

  // const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);

  useEffect(() => {
    if (!isRequirementsPending && requirements?.length) {
      setSelectedRequirement(requirements[0]);
    }
  }, [isRequirementsPending, requirements]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDenied, setIsDenied] = useState(false);
  const [denialReason, setDenialReason] = useState(""); // State to store the denial reason
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false); // State to control section modal visibility
  const [sectionModalType, setSectionModalType] = useState<
    "assign" | "reassign"
  >("reassign"); // Default to reassign modal

  const { mutate: mutateApproveOrDenyRequirement } = useMutation({
    mutationKey: [
      "assignedApproveOrDenyDocument",
      selectedRequirement?.applicationId,
      selectedRequirement?.applicationId,
    ],
    mutationFn: approveOrDenyRequirement,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      console.log("Approve or deny success");

      // Move to the next requirement
      handleNext();

      queryClient.invalidateQueries({
        queryKey: ["enrolledRequirements", selectedStudent?.studentId],
      });

      // Reset denial state
      setIsDenied(false);
    },
    onError: (error) => {
      console.log("APPROVE_OR_DENY_ERROR", error);
    },
  });

  // Function to handle section modal opening with type
  const handleSetSectionModalOpen = useCallback(
    (isOpen: boolean) => {
      setIsSectionModalOpen(isOpen);
      if (isOpen) {
        // Only set the modal type if it needs to change
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

  const handleOpenDenialReson = () => {
    setIsDenied(true);
  };

  const handleRequirementStatus = useCallback(
    (status: boolean, reason?: string) => {
      if (!selectedRequirement) return;

      mutateApproveOrDenyRequirement({
        applicationId: selectedRequirement.applicationId,
        requirementId: selectedRequirement.requirementId,
        action: status ? "approve" : "deny",
        remarks: reason,
      });

      // Create a copy of requirements
      // const updatedRequirements = requirements?.map((req) =>
      //   req.requirementName === selectedRequirement.requirementName
      //     ? { ...req, requirementStatus: status, denialReason: reason || "" }
      //     : req,
      // );

      // // Update the requirements in the selected student
      // if (selectedStudent) {
      //   setSelectedStudent({
      //     ...selectedStudent,
      //     requirements: updatedRequirements,
      //   });
      // }

      // // Update the state
      // setRequirements((prevRequirements) =>
      //   prevRequirements.map((req) =>
      //     req.requirementName === selectedRequirement.requirementName
      //       ? { ...req, requirementStatus: status, denialReason: reason || "" }
      //       : req,
      //   ),
      // );

      // // Move to the next requirement
      // handleNext();

      // // // Reset the selected requirement based on the new index
      // // setSelectedRequirement(updatedRequirements[currentIndex]);

      // // Reset denial state
      // setIsDenied(false);

      // console.log("Updated requirement:", updatedRequirements[currentIndex]);
    },
    [mutateApproveOrDenyRequirement, selectedRequirement],
  );

  useEffect(() => {
    console.log("Modal Opened with Selected Requirement:", selectedRequirement);
  }, [selectedRequirement]);

  /**
   * Load grade levels from mock data when component mounts
   */
  // useEffect(() => {
  //   setGradeLevels(mockData.gradeLevels);
  // }, []);

  /**
   * Update sections when a grade level is selected
   * Reset section selection, students list when grade level changes
   */
  // useEffect(() => {
  //   if (selectedGradeLevel) {
  //     const gradeKey = selectedGradeLevel.toString();
  //     const fetchedSections =
  //       mockData.sections[gradeKey as keyof typeof mockData.sections] || [];
  //     setSections(fetchedSections);
  //     setSelectedSection(null); // Reset selected section
  //     setStudents([]); // Reset students
  //   } else {
  //     setSections([]);
  //   }
  // }, [selectedGradeLevel]);

  /**
   * Update students when a section is selected
   * Reset student selection when section changes
   */
  // useEffect(() => {
  //   if (selectedSection) {
  //     const sectionKey = selectedSection.toString();
  //     const fetchedStudents =
  //       mockData.students[sectionKey as keyof typeof mockData.students] || [];

  //     setStudents(fetchedStudents);
  //     setSelectedStudent(null); // Reset selected student
  //   } else {
  //     setStudents([]);
  //   }
  // }, [selectedSection]);

  /**
   * Update requirements when a student is selected
   */
  // useEffect(() => {
  //   if (selectedStudent) {
  //     setRequirements(selectedStudent.requirements);
  //   } else {
  //     setRequirements([]);
  //   }
  // }, [selectedStudent]);

  // useEffect(() => {
  //   if (selectedRequirement && requirements.length > 0) {
  //     const newIndex = requirements.findIndex(
  //       (req) => req.requirementName === selectedRequirement.requirementName,
  //     );
  //     setCurrentIndex(newIndex);
  //   }
  // }, [selectedRequirement, requirements]);

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
      isGradeLevelPending,
      isSectionsPending,
      isStudentPending,
      // isRequirementsPending,
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
      "useEnrollmentReview must be used within an EnrollmentReviewProvider",
    );
  }
  return context;
};
