export interface SchoolClassification {
  schoolInfoReturn: {
    schoolType: string | null;
    acadLevels: string[];
  };

  schoolInfoParam: {
    schoolType: string;
    acadLevels: string[];
  };

  savingGradeLevels: {
    status: boolean;
    message: string;
    data: {
      offeredGradeLevels: string[];
      ids: {
        toBeUpdated: number[];
        toBeDeleted: number[];
      };
    };
  };

  savingGradeLevelsStatus: {
    success: boolean;
    message: string;
  };

  repeatedBaseSelect: {
    grade_level_offered: {
      grade_level: {
        grade_level: string;
      };
    };
  };

  fetchedOfferedGrades: {
    grade_level_offered_id: number;
    grade_level: {
      grade_level: string;
    };
    enrollment_schedule: SchoolClassification['repeatedBaseSelect'][];
    grade_section_program: SchoolClassification['repeatedBaseSelect'][];
    enrollment_application: SchoolClassification['repeatedBaseSelect'][];
  };

  notMatchedGradeLevels: {
    grades: SchoolClassification['fetchedOfferedGrades'][];
    ids: {
      toBeUpdated: number[];
      toBeDeleted: number[];
    };
  };
}
