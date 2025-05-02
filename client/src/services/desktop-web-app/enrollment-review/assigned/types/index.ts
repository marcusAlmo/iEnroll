import {
  application_status,
  attachment_status,
  attachment_type,
} from "@/services/common/types/enums";

interface GradeLevel {
  gradeId: number;
  gradeName: string;
}

export type GradeLevelResponse = GradeLevel[];

interface Section {
  sectionId: number;
  sectionName: string;
}

export type SectionResponse = Section[];

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  suffix: string | null;
  enrollmentStatus: application_status;
}

export type StudentResponse = Student[];

export interface Requirement {
  applicationId: number;
  requirementId: number;
  requirementName: string;
  requirementType: attachment_type;
  requirementStatus: attachment_status;
  fileUrl: string | null;
  fileName: string | null;
  userInput: string | null;
}

export type RequirementResponse = Requirement[];
