import Enums from "@/services/common/types/enums";
import {
  ApproveOrDenyBody,
  EnrollBody,
  EnrollmentStatus,
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

export const enrollMockStudent = (payload: EnrollBody): EnrollResponse => {
  const gradeIdx = data.findIndex((grade) =>
    grade.unassigned.some((student) => student.studentId === payload.studentId),
  );

  if (gradeIdx === -1) throw new Error("Student not found in unassigned list.");

  const grade = data[gradeIdx];

  const studentIdx = grade.unassigned.findIndex(
    (student) => student.studentId === payload.studentId,
  );
  const [student] = grade.unassigned.splice(studentIdx, 1); // This modifies `data[gradeIdx].unassigned`

  student.enrollmentStatus = Enums.application_status.accepted;

  const section = grade.sections.find(
    (sec) => sec.sectionId === payload.sectionId,
  );

  if (!section) {
    grade.unassigned.splice(studentIdx, 0, student);
    throw new Error("Target section not found in the same grade.");
  }

  section.students.push(student);

  return { success: true };
};

export const reassignMockStudentIntoDifferentSection = (
  payload: ReassignBody,
): ReassignResponse => {
  let studentFound = false;

  data.forEach((grade) => {
    grade.sections.forEach((section) => {
      const studentIdx = section.students.findIndex(
        (student) => student.studentId === payload.studentId,
      );

      if (studentIdx !== -1) {
        // Check if the student is already in the target section
        // if (section.sectionId === payload.sectionId) {
        //   throw new Error("Student is already assigned to the target section.");
        // }

        const [student] = section.students.splice(studentIdx, 1);

        const targetSection = grade.sections.find(
          (s) => s.sectionId === payload.sectionId,
        );

        if (!targetSection) {
          // Restore the student if the target section isn't found
          section.students.splice(studentIdx, 0, student);
          throw new Error("Target section not found in the same grade.");
        }

        targetSection.students.push(student);
        studentFound = true;
      }
    });
  });

  if (!studentFound) {
    throw new Error("Student not found in any section.");
  }

  return { success: true };
};

export const updateMockEnrollmentStatus = (
  payload: UpdateEnrollmentBody,
): UpdateEnrollmentResponse => {
  const { studentId, status } = payload;

  // Find the student within sections or unassigned
  let studentFound = false;

  for (const grade of data) {
    // Check within sections
    for (const section of grade.sections) {
      const student = section.students.find((s) => s.studentId === studentId);
      if (student) {
        processStatusChange(student, status);
        studentFound = true;
        return {
          success: true,
        };
      }
    }

    // Check within unassigned
    const student = grade.unassigned.find((s) => s.studentId === studentId);
    if (student) {
      processStatusChange(student, status);
      studentFound = true;
      return {
        success: true,
      };
    }
  }

  if (!studentFound) {
    throw new Error("ERR_APPLICATION_NOT_FOUND");
  }

  throw new Error("Something is wrong.");
};

function processStatusChange(
  student: {
    enrollmentStatus: string;
    requirements: { requirementStatus: string }[];
  },
  status: EnrollmentStatus,
) {
  if (!student.requirements || student.requirements.length === 0) {
    throw new Error("ERR_NO_REQUIREMENTS_FOUND");
  }

  switch (status) {
    case EnrollmentStatus.ACCEPTED: {
      const hasAcceptedRequirements = student.requirements.every(
        (req) => req.requirementStatus === Enums.attachment_status.accepted,
      );
      if (!hasAcceptedRequirements) {
        throw new Error("ERR_REQUIREMENTS_NOT_COMPLETED");
      }
      student.enrollmentStatus = Enums.application_status.accepted;
      break;
    }

    case EnrollmentStatus.DENIED: {
      const hasAllInvalidRequirements = student.requirements.every(
        (req) => req.requirementStatus === Enums.attachment_status.invalid,
      );
      if (!hasAllInvalidRequirements) {
        throw new Error("ERR_DENIED_REQUIRES_ALL_INVALID");
      }
      student.enrollmentStatus = Enums.application_status.denied;
      break;
    }

    case EnrollmentStatus.INVALID: {
      let hasInvalid = false;
      let hasNonInvalid = false;

      for (const requirement of student.requirements) {
        if (
          requirement.requirementStatus === Enums.application_status.invalid
        ) {
          hasInvalid = true;
        } else {
          hasNonInvalid = true;
        }

        if (hasInvalid && hasNonInvalid) break;
      }

      if (!hasInvalid || !hasNonInvalid) {
        throw new Error("ERR_INVALID_REQUIRES_PARTIAL_INVALID_ONLY");
      }

      student.enrollmentStatus = Enums.application_status.invalid;
      break;
    }

    default:
      throw new Error("ERR_INVALID_STATUS");
  }
}
