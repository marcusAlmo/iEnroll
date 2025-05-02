export interface SchoolClassification {
  schoolInfoReturn: {
    schoolType: string | null;
    acadLevels: string[];
  };

  getSchoolClassification: {
    schoolType: string;
    acadLevels: string[];
    gradeLevels: string[];
  };

  successMessage: {
    message: string;
  };

  schoolInfoParam: {
    schoolType: string;
    acadLevels: string[];
    gradeLevels: string[];
  };

  savingGradeLevelsStatus: {
    success: boolean;
    message: string;
  };

  idObject: {
    toBeUpdated: number[];
    toBeDeleted: number[];
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
    ids: SchoolClassification['idObject'];
  };

  finalOutput: {
    schoolType: string;
    academicLevels: {
      name: string;
      checked: boolean;
    }[];
    gradeLevels: {
      name: string;
      checked: boolean;
    }[];
  };

  getDataReturnType: {
    schoolType: string;
    supportedAcadLevel: string[];
  };

  retrievedGradeLevels: {
    academicLevels: string[];
    gradeLevels: string[];
  };

  deletableReturn: {
    grades: string[];
    ids: number[];
  };
}
