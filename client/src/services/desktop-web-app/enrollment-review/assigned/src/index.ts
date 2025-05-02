import { instance } from "@/lib/axios";
import { GradeLevelResponse } from "../types";
import {
  getGradeLevels,
  getRequirementsByStudentId,
  getSectionsByGradeId,
  getStudentsBySectionId,
} from "./test";

export const getAllGradeLevels = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      "/api/enrollment/review/assigned/grade-levels",
    );
  else return { data: getGradeLevels() };
};

export const getAllSectionsByGradeLevel = async (gradeLevelId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      `/api/enrollment/review/assigned/sections/${gradeLevelId}`,
    );
  else return { data: getSectionsByGradeId(gradeLevelId) };
};

// TODO: Make logic for unassigned students
export const getAllStudentsEnrolledBySection = async (sectionId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      `/api/enrollment/review/assigned/section/${sectionId}`,
    );
  else return { data: getStudentsBySectionId(sectionId) };
};

export const getAllRequirementsByStudentId = async (studentId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<GradeLevelResponse>(
      `/api/enrollment/review/assigned/requirements/${studentId}`,
    );
  else return { data: getRequirementsByStudentId(studentId) };
};
