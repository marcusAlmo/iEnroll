export interface EnrollmentTrendData {
  enrollmentRecord: {
    grade: string;
    [year: number]: number | string; // year keys are numbers, values are counts
  };

  finalOutput: {
    record: EnrollmentTrendData['enrollmentRecord'][];
    years: number[];
  };

  enrollmentTrendData: Array<this['enrollmentRecord']>;

  gradeLevelInfo: {
    gradeLevel: string;
    gradeLevelOfferedId: number;
  };

  gradeLevelInfoArr: Array<this['gradeLevelInfo']>;
}
