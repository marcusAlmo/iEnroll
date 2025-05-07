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
  UpdateEnrollmentBody,
  UpdateEnrollmentResponse,
} from "../types";
import {
  getGradeLevels,
  getRequirementsByStudentId,
  getSectionsByGradeId,
  getAssignedStudentsBySectionId,
  getUnassignedStudentsByGradeSectionProgramId,
  approveOrDenyMockRequirement,
  enrollMockStudent,
  reassignMockStudentIntoDifferentSection,
  updateMockEnrollmentStatus,
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

export const getAllStudentsUnassignedByGradeSectionProgram = async (
  gradeSectionProgramId: number[],
) => {
  // Handle environment conditions
  const baseUrl = `/api/enrollment/review/students/unassigned/`;

  const id =
    gradeSectionProgramId.length === 1
      ? gradeSectionProgramId[0]
      : gradeSectionProgramId;

  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    // If id is an array, join it as a comma-separated string
    const url = Array.isArray(id)
      ? `${baseUrl}?gradeSectionProgramIds=${id.join(",")}`
      : `${baseUrl}${id}`;

    // Make the request using axios
    return instance.get<StudentResponse>(url);
  } else {
    // Fallback to local data retrieval for non-production environments
    return {
      data: getUnassignedStudentsByGradeSectionProgramId(id),
    };
  }
};

// export const getAllStudentsUnassignedByGradeLevel = async (gradeId: number) => {
//   if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
//     return instance.get<StudentResponse>(
//       `/api/enrollment/review//students/unassigned/${gradeId}`,
//     );
//   else return { data: getUnasssignedStudentsByGradeId(gradeId) };
// };

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

export const updateEnrollmentStatus = async (payload: UpdateEnrollmentBody) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.patch<UpdateEnrollmentResponse>(
      `/api/enrollment/review/assigned/enrollment/status`,
      payload,
    );
  else return { data: updateMockEnrollmentStatus(payload) };
};
