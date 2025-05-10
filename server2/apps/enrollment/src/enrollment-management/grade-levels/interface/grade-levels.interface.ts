export interface GradeLevels {
  gradeLevels: {
    grade_section_program_id: number;
    grade_section: {
      grade_section_id: number;
      section_name: string;
      adviser: string | null; // Adjusted to nullable if adviser may not always be assigned
      admission_slot: number;
      max_application_slot: number;
    }[];
    academic_program: {
      program: string;
      description: string;
    };
    grade_level_offered: {
      grade_level_offered_id: number;
      grade_level: {
        grade_level: string;
      };
    };
  }[];

  fixedFormat: {
    gradeLevel: string;
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
  }[];
}
