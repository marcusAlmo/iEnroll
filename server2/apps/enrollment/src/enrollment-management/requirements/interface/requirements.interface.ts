import { $Enums } from '@prisma/client';
export interface Requirements {
  retrieveRequirementsRaw: {
    grade_level_offered_id: number;
    enrollment_requirement: {
      name: string;
      requirement_type: string;
      accepted_data_type: string;
      is_required: boolean | null;
      description: string | null;
    }[];
    grade_level_offered: {
      grade_level: {
        grade_level_code: string;
        grade_level: string;
      };
    };
  }[];

  processedRequirements: {
    gradeLevelOfferedId: number;
    gradeLevel: string;
    gradeLevelCode: string;
    requirements: {
      name: string;
      type: string;
      dataType: string;
      isRequired: boolean | null;
      description: string | null;
    }[];
  }[];

  receivedData: {
    gradeLevelCodes: string[];
    sectionId: number[];
    requirements: {
      name: string;
      type: string;
      dataType: string;
      isRequired: boolean;
      description: string;
    };
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
}
