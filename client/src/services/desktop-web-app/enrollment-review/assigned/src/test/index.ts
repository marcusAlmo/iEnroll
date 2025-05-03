import Enums from "@/services/common/types/enums";
import {
  ApproveOrDenyBody,
  GradeLevelResponse,
  Requirement,
  RequirementResponse,
  SectionResponse,
  StudentResponse,
} from "../../types";
import { data } from "./sample-data";

export const getGradeLevels = (): GradeLevelResponse => {
  return data.map((item) => ({
    gradeId: item.gradeId,
    gradeName: item.gradeName,
  }));
};

export const getSectionsByGradeId = (gradeId: number): SectionResponse => {
  const grade = data.find((item) => item.gradeId === gradeId);
  if (!grade) return [];
  return grade.sections.map((section) => ({
    sectionId: section.sectionId,
    sectionName: section.sectionName,
  }));
};

export const getAssignedStudentsBySectionId = (
  sectionId: number,
): StudentResponse => {
  const grade = data.find((item) =>
    item.sections.some((section) => section.sectionId === sectionId),
  );
  if (!grade) return [];

  const section = grade.sections.find(
    (section) => section.sectionId === sectionId,
  );

  if (!section) return [];

  return section.students.map((student) => ({
    studentId: student.studentId,
    firstName: student.firstName,
    lastName: student.lastName,
    middleName: student.middleName,
    suffix: student.suffix,
    enrollmentStatus: student.enrollmentStatus,
  }));
};

export const getUnasssignedStudentsByGradeId = (
  gradeId: number,
): StudentResponse => {
  const grade = data.find((item) => item.gradeId === gradeId);
  if (!grade) return [];

  return grade.unassigned.map((student) => ({
    studentId: student.studentId,
    firstName: student.firstName,
    lastName: student.lastName,
    middleName: student.middleName,
    suffix: student.suffix,
    enrollmentStatus: student.enrollmentStatus,
  }));
};

export const getRequirementsByStudentId = (
  studentId: number,
): RequirementResponse => {
  const grade = data.find((gradeLevel) => {
    const inSection = gradeLevel.sections.some((section) =>
      section.students.some((s) => s.studentId === studentId),
    );
    const inUnassigned = gradeLevel.unassigned.some(
      (s) => s.studentId === studentId,
    );
    return inSection || inUnassigned;
  });

  if (!grade) return [];

  const section =
    grade.sections.find((section) =>
      section.students.some((s) => s.studentId === studentId),
    ) || null;

  const student =
    section?.students.find((s) => s.studentId === studentId) ??
    grade.unassigned.find((s) => s.studentId === studentId);

  if (!student) return [];

  return student.requirements.map((req) => ({
    applicationId: req.applicationId,
    requirementId: req.requirementId,
    requirementName: req.requirementName,
    requirementType: req.requirementType,
    requirementStatus: req.requirementStatus,
    fileUrl: req.fileUrl,
    fileName: req.fileName,
    userInput: req.userInput,
    remarks: req.remarks,
  }));
};

export const approveOrDenyMockRequirement = (
  payload: ApproveOrDenyBody,
): Requirement => {
  const { applicationId, requirementId, action, remarks } = payload;

  const grade = data.find((gradeLevel) => {
    const inSection = gradeLevel.sections.some((section) =>
      section.students.some((s) =>
        s.requirements.some((r) => r.applicationId === applicationId),
      ),
    );
    const inUnassigned = gradeLevel.unassigned.some((s) =>
      s.requirements.some((r) => r.applicationId === applicationId),
    );
    return inSection || inUnassigned;
  });

  if (!grade) throw new Error("Grade level not found");

  const section =
    grade.sections.find((section) =>
      section.students.some((s) =>
        s.requirements.some((r) => r.applicationId === applicationId),
      ),
    ) || null;

  const student =
    section?.students.find((s) =>
      s.requirements.some((r) => r.applicationId === applicationId),
    ) ??
    grade.unassigned.find((s) =>
      s.requirements.some((r) => r.applicationId === applicationId),
    );

  if (!student) throw new Error("Student not found");

  const requirement = student.requirements.find(
    (r) =>
      r.applicationId === applicationId && r.requirementId === requirementId,
  );

  if (!requirement) {
    throw new Error("Requirement not found");
  }

  switch (action) {
    case "approve":
      requirement.requirementStatus = Enums.attachment_status.accepted;
      break;
    case "deny":
      requirement.requirementStatus = Enums.attachment_status.invalid;
      break;
    default:
      requirement.requirementStatus = Enums.attachment_status.pending;
      break;
  }

  requirement.remarks = remarks ?? null;

  return requirement;
};
