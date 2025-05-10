export interface GradeLevels {
  gradeLevels: {
    grade_section_program: {
      grade_section_program_id: number;
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
    sectionId: number;
    programName: string | undefined;
    programId: number | undefined;
    sectionName: string;
    adviser: string;
    admissionSlot: number;
    maxApplicationSlot: number;
    gradeSectionProgramId: number;
    isUpdate: boolean;
  };

  retrievedGradeLevels: {
    gradeLevelCode: string;
    gradeLevel: string;
    gradeLevelOfferedId: number;
  };
}

/**
 * grade_section_program_id: true,
          grade_section: {
            select: {
              grade_section_id: true,
              section_name: true,
              adviser: true,
              admission_slot: true,
              max_application_slot: true,
            },
          },
          academic_program: {
            select: {
              program: true,
              description: true,
            },
          },
          grade_level_offered: {
            select: {
              grade_level_offered_id: true,
              grade_level_code: true,
              grade_level: {
                select: {
                  grade_level: true,
                },
              },
            },
          },
 */
