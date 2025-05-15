import { $Enums } from '@prisma/client';
export interface Requirements {
  retrieveRequirementsRaw: {
    grade_level_offered_id: number;
    grade_level_code: string;
    grade_level: {
      grade_level: string;
    };
    grade_level_program: {
      enrollment_requirement: {
        requirement_id: number;
        name: string;
        requirement_type: string;
        accepted_data_type: string;
        is_required: boolean | null;
        description: string | null;
      }[];
      academic_program: {
        program: string;
        program_id: number;
      };
    }[];
  }[];

  processedRequirements: {
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
      program: string | null;
      programId: number | null;
    }[];
  }[];

  receivedData: {
    gradeLevelOfferedId: number;
    requirements: {
      name: string;
      type: string;
      dataType: string;
      programId: number;
      isRequired: boolean;
      description: string;
    }[];
  };

  retrievedGradeSectionProgramId: {
    programId: number;
    grade_level_program_id: number;
  }[];

  dataForProcessing: {
    tobeCreated: string[];
    toBeCreatedRequirements: number[];
  };

  finalData: {
    grade_level_program_id: number;
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
    programId: number;
  };
}
