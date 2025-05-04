import { instance } from "@/lib/axios";
import {
  ApproveOrDenyBody,
  EnrollBody,
  EnrollResponse,
  GradeLevelResponse,
  ReassignBody,
  ReassignResponse,
  Requirement,
  RequirementResponse,
  SectionResponse,
  StudentResponse,
} from "../types";
import {
  getGradeLevels,
  getRequirementsByStudentId,
  getSectionsByGradeId,
  getAssignedStudentsBySectionId,
  getUnasssignedStudentsByGradeId,
  approveOrDenyMockRequirement,
  enrollMockStudent,
  reassignMockStudentIntoDifferentSection,
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
    return instance.get<SectionResponse>(
      `/api/enrollment/review/assigned/sections/${gradeLevelId}`,
    );
  else return { data: getSectionsByGradeId(gradeLevelId) };
};

export const getAllStudentsAssignedBySection = async (sectionId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<StudentResponse>(
      `/api/enrollment/review/students/assigned/${sectionId}`,
    );
  else return { data: getAssignedStudentsBySectionId(sectionId) };
};

export const getAllStudentsUnassignedByGradeLevel = async (gradeId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<StudentResponse>(
      `/api/enrollment/review//students/unassigned/${gradeId}`,
    );
  else return { data: getUnasssignedStudentsByGradeId(gradeId) };
};

export const getAllRequirementsByStudentId = async (studentId: number) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<RequirementResponse>(
      `/api/enrollment/review/assigned/requirements/${studentId}`,
    );
  else return { data: getRequirementsByStudentId(studentId) };
};

export const approveOrDenyRequirement = async (payload: ApproveOrDenyBody) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.post<Requirement>(
      `/api/enrollment/review/assigned/requirements/approve-or-deny`,
      payload,
    );
  else return { data: approveOrDenyMockRequirement(payload) };
};

export const enrollStudent = async (payload: EnrollBody) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.post<EnrollResponse>(
      `/api/enrollment/review/assigned/enroll`,
      payload,
    );
  else return enrollMockStudent(payload);
};

export const reassignStudentIntoDifferentSection = async (
  payload: ReassignBody,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.post<ReassignResponse>(
      `/api/enrollment/review/assigned/section/reassign`,
      payload,
    );
  else return reassignMockStudentIntoDifferentSection(payload);
};
