interface GradeLevel {
  gradeId: number;
  gradeName: string;
}

export type GradeLevelResponse = GradeLevel[];

interface Section {
  sectionId: number;
  sectionName: string;
}

export type SectionResponse = Section[];

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  suffix: string | null;
  enrollmentStatus: string;
  enrollmentDate: Date;
  gradeLevel: string;
  sectionName: string;
}
export type StudentResponse = Student[];
