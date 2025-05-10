import { $Enums } from '@prisma/client';
export interface Requirements {
  retrieveRequirementsRaw: {
    grade_level_offered_id: number;
    grade_level_code: string;
    grade_level: {
      grade_level: string;
    };
    grade_section_program: {
      grade_section_program_id: number;
      enrollment_requirement: {
        requirement_id: number;
        name: string;
        requirement_type: string;
        accepted_data_type: string;
        is_required: boolean | null;
        description: string | null;
      }[];
    }[];
  }[];

  processedRequirements: {
    gradeSectionProgramId: number;
    gradeLevelOfferedId: number;
    gradeLevel: string;
    gradeLevelCode: string;
    requirements: {
      requirementId: number;
      name: string;
      type: string;
      dataType: string;
      isRequired: boolean | null;
      description: string | null;
    }[];
  }[];

  receivedData: {
    gradeSectionProgramId: number;
    requirements: {
      name: string;
      type: string;
      dataType: string;
      isRequired: boolean;
      description: string;
    }[];
  };

  dataForProcessing: {
    tobeCreated: string[];
    toBeCreatedRequirements: number[];
  };

  finalData: {
    grade_section_program_id: number;
    name: string;
    requirement_type: $Enums.requirement_type;
    accepted_data_type: $Enums.accepted_data_type;
    is_required: boolean;
    description: string;
  };

  updateRequirement: {
    dataType: string;
    requirementId: number;
    description: string;
    isRequired: boolean;
    name: string;
    type: string;
  };
}
