interface Section {
  id: number;
  name: string;
  max_slot: number;
}

interface Schedule {
  startDatetime: Date;
  endDatetime: Date;
  slotsLeft: number | null;
}

interface GradeSectionType {
  id: number;
  type: string;
  sections: Section[];
}

interface GradeLevel {
  name: string;
  code: string;
  schedule: Schedule[] | null;
  note?: string;
  gradeSectionType: GradeSectionType[];
}

interface AcademicLevel {
  name: string;
  code: string;
  gradeLevels: GradeLevel[];
}

export type SchoolLevelAndScheduleReturn = AcademicLevel[];
