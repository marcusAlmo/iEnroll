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
    programName: "Regular",
    gradeSectionProgramId: 1,
  }));
};

export const getStudentsBySectionId = (
  sectionId: number,
  keyword?: string,
): StudentResponse => {
  const grade = data.find((item) =>
    item.sections.some((section) => section.sectionId === sectionId),
  );
  if (!grade) return [];

  const section = grade.sections.find(
    (section) => section.sectionId === sectionId,
  );
  if (!section) return [];

  const normalizedKeyword = keyword?.toLowerCase().trim();

  const scoredStudents = section.students
    .map((student) => {
      const fullName =
        `${student.firstName} ${student.middleName ?? ""} ${student.lastName} ${student.suffix ?? ""}`.toLowerCase();
      const studentIdStr = student.studentId.toString();

      let score = 0;

      if (!normalizedKeyword) {
        score = 0; // no search — neutral relevance
      } else if (studentIdStr === normalizedKeyword) {
        score = 100;
      } else if (fullName === normalizedKeyword) {
        score = 90;
      } else if (studentIdStr.includes(normalizedKeyword)) {
        score = 70;
      } else if (fullName.includes(normalizedKeyword)) {
        score = 60;
      }

      return { student, score };
    })
    .filter(({ score }) => (keyword ? score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ student }) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      suffix: student.suffix,
      enrollmentStatus: student.applicationStatus,
      enrollmentDate: student.enrollmentDate,
      gradeLevel: grade.gradeName,
      sectionName: section.sectionName,
    }));

  return scoredStudents;
};

export const getStudentsByGradeLevelId = (
  gradeLevelId: number,
  keyword?: string,
): StudentResponse => {
  const grade = data.find((item) => item.gradeId === gradeLevelId);
  if (!grade) return [];

  const allStudents = grade.sections.flatMap((section) =>
    section.students.map((student) => ({
      ...student,
      gradeLevel: grade.gradeName,
      sectionName: section.sectionName,
    })),
  );

  const normalizedKeyword = keyword?.toLowerCase().trim();

  return allStudents
    .map((student) => {
      const fullName =
        `${student.firstName} ${student.middleName ?? ""} ${student.lastName} ${student.suffix ?? ""}`.toLowerCase();
      const studentIdStr = student.studentId.toString();

      let score = 0;

      if (!normalizedKeyword) {
        score = 0; // no search — neutral relevance
      } else if (studentIdStr === normalizedKeyword) {
        score = 100;
      } else if (fullName === normalizedKeyword) {
        score = 90;
      } else if (studentIdStr.includes(normalizedKeyword)) {
        score = 70;
      } else if (fullName.includes(normalizedKeyword)) {
        score = 60;
      }

      return { student, score };
    })
    .filter(({ score }) => (keyword ? score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ student }) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      suffix: student.suffix,
      enrollmentStatus: student.applicationStatus,
      enrollmentDate: student.enrollmentDate,
      gradeLevel: student.gradeLevel,
      sectionName: student.sectionName,
    }));
};

export const getStudentsEnrolled = (keyword?: string): StudentResponse => {
  const allStudents = data.flatMap((item) =>
    item.sections.flatMap((section) =>
      section.students.map((student) => ({
        ...student,
        gradeLevel: item.gradeName,
        sectionName: section.sectionName,
      })),
    ),
  );

  if (!keyword) {
    return allStudents.map((student) => ({
      ...student,
      enrollmentStatus: student.applicationStatus,
    }));
  }

  const normalizedKeyword = keyword.toLowerCase().trim();

  return allStudents
    .map((student) => {
      const fullName =
        `${student.firstName} ${student.middleName ?? ""} ${student.lastName} ${student.suffix ?? ""}`.toLowerCase();
      const studentIdStr = student.studentId.toString();

      let score = 0;

      if (studentIdStr === normalizedKeyword) {
        score = 100;
      } else if (fullName === normalizedKeyword) {
        score = 90;
      } else if (studentIdStr.includes(normalizedKeyword)) {
        score = 70;
      } else if (fullName.includes(normalizedKeyword)) {
        score = 60;
      }

      return { student, score };
    })
    .filter(({ score }) => (keyword ? score > 0 : true))
    .sort((a, b) => b.score - a.score)
    .map(({ student }) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      suffix: student.suffix,
      enrollmentStatus: student.applicationStatus,
      enrollmentDate: student.enrollmentDate,
      gradeLevel: student.gradeLevel,
      sectionName: student.sectionName,
    }));
};
