import {
  AcademicLevelResponse,
  ScheduleResponse,
  SectionResponse,
} from "../../types";
import { academicLevels } from "./sample-data";

export const getMockSchoolLevelAndScheduleSelection = () => {
  return academicLevels;
};

export const getMockAcademicLevelsBySchool = (): AcademicLevelResponse => {
  return academicLevels.map((level) => ({
    academicLeveLCode: level.code,
    academicLevel: level.name,
  }));
};

export const getMockGradeLevelsByAcademicLevel = (
  academicLevelCode: string,
) => {
  const level = academicLevels.find(
    (level) => level.code === academicLevelCode,
  );
  if (!level) return [];

  return level.gradeLevels.map((grade) => ({
    gradeLevelCode: grade.code,
    gradeLevel: grade.name,
  }));
};

export const getMockSchedulesByGradeLevel = (
  gradeLevelCode: string,
): ScheduleResponse => {
  for (const level of academicLevels) {
    const grade = level.gradeLevels.find((g) => g.code === gradeLevelCode);
    if (grade) {
      return (
        grade.schedule?.map((sched) => ({
          dateStart: sched.startDatetime,
          dateEnd: sched.endDatetime,
          slotsLeft: sched.slotsLeft ?? undefined,
        })) ?? []
      );
    }
  }
  return [];
};

export const getMockSectionsByGradeLevel = (
  gradeLevelCode: string,
): SectionResponse => {
  for (const level of academicLevels) {
    const grade = level.gradeLevels.find((g) => g.code === gradeLevelCode);
    if (!grade) continue;

    const programs = grade.gradeSectionType.map((program, index) => ({
      programId: program.id.toString(),
      programName: program.type,
      // just mock, tinamad na ako maglagay haha
      gradeSectionProgramId: index + 1,
      sections: program.sections.map((section) => ({
        gradeSectionId: section.id,
        sectionName: section.name,
        maxSlot: section.max_slot,
      })),
    }));

    return programs;
  }

  return [];
};
