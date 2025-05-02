import {
  GradeLevelResponse,
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

export const getStudentsBySectionId = (sectionId: number): StudentResponse => {
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

export const getRequirementsByStudentId = (studentId: number) => {
  const grade = data.find((item) =>
    item.sections.some((section) =>
      section.students.some((student) => student.studentId === studentId),
    ),
  );
  if (!grade) return [];

  const section = grade.sections.find((section) =>
    section.students.some((student) => student.studentId === studentId),
  );
  if (!section) return [];

  const student = section.students.find(
    (student) => student.studentId === studentId,
  );
  if (!student) return [];

  return student.requirements.map((requirement) => ({
    applicationId: requirement.applicationId,
    requirementId: requirement.requirementId,
    requirementName: requirement.requirementName,
    requirementType: requirement.requirementType,
    requirementStatus: requirement.requirementStatus,
    fileUrl: requirement.fileUrl,
    fileName: requirement.fileName,
    userInput: requirement.userInput,
  }));
};
