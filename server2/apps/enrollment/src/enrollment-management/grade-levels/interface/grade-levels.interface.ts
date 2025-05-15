export interface GradeLevels {
  gradeLevels: {
    grade_level_program: {
      grade_level_program_id: number;
      academic_program: {
        program: string;
        description: string;
      };
      grade_section: {
        grade_section_id: number;
        section_name: string;
        adviser: string;
        admission_slot: number;
        max_application_slot: number;
      }[];
    }[];
    grade_level_offered_id: number;
    grade_level_code: string;
    grade_level: {
      grade_level: string;
    };
  }[];

  fixedFormat: {
    gradeLevel: string;
    gradeSectionProgramId: number;
    gradeLevelOfferedId: number;
    sections: {
      gradeSectionProgramId: number;
      sectionId: number;
      sectionName: string;
      adviser: string | null;
      admissionSlot: number;
      maxApplicationSlot: number;
      isCustomProgram: boolean;
      programDetails:
        | {
            program: string;
            description: string;
          }
        | undefined;
    }[];
  };

  programList: {
    programId: number;
    program: string;
    description: string;
  }[];

  receivedData: {
    gradeLevelOfferedId: number;
    programName: string;
    programId: number;
    sectionName: string;
    adviser: string;
    admissionSlot: number;
    maxApplicationSlot: number;
    gradeSectionProgramId: number | undefined;
    isUpdate: boolean;
  };

  retrievedGradeLevels: {
    gradeLevelCode: string;
    gradeLevel: string;
    gradeLevelOfferedId: number;
  };
}
