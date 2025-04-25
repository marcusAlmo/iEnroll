export interface GradeLevels {
  selectedGadeLevels: {
    grade_level: {
      grade_level_code: string;
      grade_level: string;
    };
    grade_section_program: {
      grade_section: {
        grade_section_id: number;
        section_name: string;
        adviser: string;
        admission_slot: number;
        max_application_slot: number;
      }[];
      academic_program: {
        program_id: number;
        program: string;
      };
    }[];
  }[];
}
