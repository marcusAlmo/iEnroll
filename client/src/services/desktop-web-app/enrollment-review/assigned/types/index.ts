import {
  application_status,
  attachment_status,
  attachment_type,
} from "@/services/common/types/enums";

export interface GradeLevel {
  gradeId: number;
  gradeName: string;
}

export type GradeLevelResponse = GradeLevel[];

export interface Section {
  gradeSectionProgramId: number;
  programName: string;
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
  remarks: string | null;
}

export type RequirementResponse = Requirement[];

export interface ApproveOrDenyBody {
  action: "approve" | "deny";
  applicationId: number;
  requirementId: number;
  remarks?: string;
}

export interface EnrollBody {
  studentId: number;
  sectionId: number;
  enrollmentRemarks?: string;
}

export interface ReassignBody {
  studentId: number;
  sectionId: number;
}

export interface EnrollResponse {
  success: boolean;
}

export interface ReassignResponse {
  success: boolean;
}

export enum EnrollmentStatus {
  ACCEPTED = "accepted",
  DENIED = "denied",
  INVALID = "invalid",
}

export interface UpdateEnrollmentBody {
  status: EnrollmentStatus;
  studentId: number;
}

export interface UpdateEnrollmentResponse {
  success: boolean;
}
