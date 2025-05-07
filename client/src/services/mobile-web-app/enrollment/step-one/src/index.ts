import { instance } from "@/lib/axios";
import {
  AcademicLevelResponse,
  GradeLevelResponse,
  ScheduleResponse,
  SchoolLevelAndScheduleResponse,
  SectionResponse,
} from "../types";
import {
  getMockAcademicLevelsBySchool,
  getMockGradeLevelsByAcademicLevel,
  getMockSchedulesByGradeLevel,
  getMockSchoolLevelAndScheduleSelection,
  getMockSectionsByGradeLevel,
} from "./test";

export const getSchoolLevelAndScheduleSelection = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<SchoolLevelAndScheduleResponse>(
      `/api/enrollment/enroll/school-selection`,
    );
  else return { data: getMockSchoolLevelAndScheduleSelection() };
};
export const getAcademicLevelsBySchool = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<AcademicLevelResponse>(
      `/api/enrollment/enroll/selection/academic-levels`,
    );
  else return { data: getMockAcademicLevelsBySchool() };
};
export const getGradeLevelsByAcademicLevel = (academicLevelCode: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      `/api/enrollment/enroll/selection/grade-levels/${academicLevelCode}`,
    );
  else return { data: getMockGradeLevelsByAcademicLevel(academicLevelCode) };
};
export const getSchedulesByGradeLevel = (gradeLevelCode: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<ScheduleResponse>(
      `/api/enrollment/enroll/selection/schedules/${gradeLevelCode}`,
    );
  else return { data: getMockSchedulesByGradeLevel(gradeLevelCode) };
};
export const getSectionsByGradeLevel = (gradeLevelCode: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<SectionResponse>(
      `/api/enrollment/enroll/selection/sections/${gradeLevelCode}`,
    );
  else return { data: getMockSectionsByGradeLevel(gradeLevelCode) };
};
