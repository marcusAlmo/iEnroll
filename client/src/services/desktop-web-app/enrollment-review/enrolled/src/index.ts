import { instance } from "@/lib/axios";
import {
  getGradeLevels,
  getSectionsByGradeId,
  getStudentsByGradeLevelId,
  getStudentsBySectionId,
  getStudentsEnrolled,
} from "./test";
import { GradeLevelResponse, SectionResponse, StudentResponse } from "../types";

export const getAllGradeLevels = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      "/api/enrollment/review/enrolled/grade-levels",
    );
  else return { data: getGradeLevels() };
};
export const getAllSectionsByGradeLevel = async (gradeLevelId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<SectionResponse>(
      `/api/enrollment/review/enrolled/sections/${gradeLevelId}`,
    );
  else return { data: getSectionsByGradeId(gradeLevelId) };
};
export const getAllStudentsEnrolledBySection = async (
  sectionId: number,
  keyword?: string,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<StudentResponse>(
      `/api/enrollment/review/enrolled/students/section/${sectionId}`,
      { params: { keyword } },
    );
  else return { data: getStudentsBySectionId(sectionId, keyword) };
};

export const getAllStudentsEnrolled = async (keyword?: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<StudentResponse>(
      `/api/enrollment/review/enrolled/students/school`,
      { params: { keyword } },
    );
  else return { data: getStudentsEnrolled(keyword) };
};

export const getAllStudentsEnrolledByGradeLevel = async (
  gradeLevelId: number,
  keyword?: string,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<StudentResponse>(
      `/api/enrollment/review/enrolled/students/grade-level/${gradeLevelId}`,
      { params: { keyword } },
    );
  else return { data: getStudentsByGradeLevelId(gradeLevelId, keyword) };
};
