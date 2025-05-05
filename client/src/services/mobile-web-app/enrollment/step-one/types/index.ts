interface ASection {
  id: number;
  name: string;
  max_slot: number;
}

interface ASchedule {
  startDatetime: Date;
  endDatetime: Date;
  slotsLeft: number | null;
}

interface AGradeSectionType {
  id: number;
  type: string;
  sections: ASection[];
}

interface AGradeLevel {
  name: string;
  code: string;
  schedule: ASchedule[] | null;
  note?: string;
  gradeSectionType: AGradeSectionType[];
}

interface AAcademicLevel {
  name: string;
  code: string;
  gradeLevels: AGradeLevel[];
}

export type SchoolLevelAndScheduleResponse = AAcademicLevel[];

export interface AcademicLevel {
  academicLeveLCode: string;
  academicLevel: string;
}

export type AcademicLevelResponse = AcademicLevel[];

export interface GradeLevel {
  gradeLevelCode: string;
  gradeLevel: string;
}

export type GradeLevelResponse = GradeLevel[];

export interface Schedule {
  dateStart: Date;
  dateEnd: Date;
  slotsLeft: number | undefined;
}

export type ScheduleResponse = Schedule[];

interface GradeSectionType {
  gradeSectionId: number;
  gradeSectionType: string;
}

export type GradeSectionTypeResponse = GradeSectionType[];

interface Section {
  gradeSectionId: number;
  sectionName: string;
  maxSlot: number;
}

interface Program {
  programId: string;
  programName: string;
  sections: Section[];
}

export type SectionResponse = Program[];
