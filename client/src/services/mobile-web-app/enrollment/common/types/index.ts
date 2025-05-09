import Enums from "@/services/common/types/enums";

export interface EnrollmentDetails {
  gradeSectionProgramId: number;
  scheduleId: number;
  remarks?: string;
  gradeSectionId?: number;
}

export interface PaymentDetails {
  paymentOptionId: number;
}

export interface RequirementText {
  requirementId: number;
  attachmentType: typeof Enums.attachment_type.text;
  textContent: string;
}

export interface RequirementFile {
  requirementId: number;
  attachmentType:
    | typeof Enums.attachment_type.document
    | typeof Enums.attachment_type.image;
}

export type RequirementDetails = RequirementFile | RequirementText;

export interface EnrollmentApplicationBody {
  details: EnrollmentDetails;
  payment: PaymentDetails;
  requirements: RequirementDetails[];
}
