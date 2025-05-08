import {
  accepted_data_type,
  requirement_type,
} from "@/services/common/types/enums";

interface Requirement {
  requirementId: number;
  name: string;
  requirementType: requirement_type;
  acceptedDataTypes: accepted_data_type;
  isRequired: boolean | null;
}

export type RequirementsForReuploadResponse = Requirement[];
export interface RequirementPayloadBody {
  requirementId: number;
  textContent?: string;
  fileId?: number;
}
