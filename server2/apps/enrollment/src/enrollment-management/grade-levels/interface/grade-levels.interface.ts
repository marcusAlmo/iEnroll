export interface GradeLevels {
  gradeLevels: {
    grade_section: {
      grade_section_id: number;
      section_name: string;
      adviser: string | null; // Adjusted to nullable if adviser may not always be assigned
      admission_slot: number;
      max_application_slot: number;
    }[];
    academic_program: {
      program: string;
    };
    grade_level_offered: {
      grade_level: {
        grade_level: string; // Represents the grade level (e.g., "Grade 10")
      };
    };
  }[];

  fixedFormat: {
    gradeLevel: string;
    sections: {
      sectionId: number;
      sectionName: string;
      adviser: string | null; // Adjusted to nullable if adviser may not always be assigned
      admissionSlot: number;
      maxApplicationSlot: number;
      program: string;
    }[];
  };
}
