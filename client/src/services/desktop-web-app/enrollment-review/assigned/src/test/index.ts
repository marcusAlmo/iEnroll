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

  return grade.programs.flatMap((program) =>
    program.sections.map((section) => ({
      sectionId: section.sectionId,
      sectionName: section.sectionName,
      gradeSectionProgramId: section.gradeSectionProgramId,
      programName: program.programName,
    })),
  );
};

export const getAssignedStudentsBySectionId = (
  sectionId: number,
): StudentResponse => {
  const grade = data.find((item) =>
    item.programs.some((program) =>
      program.sections.some((section) => section.sectionId === sectionId),
    ),
  );
  if (!grade) return [];

  const program = grade.programs.find((program) =>
    program.sections.some((section) => section.sectionId === sectionId),
  );

  if (!program) return [];

  const section = program.sections.find(
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

export const getUnassignedStudentsByGradeSectionProgramId = (
  gradeSectionProgramId: number | number[],
): StudentResponse => {
  const ids = Array.isArray(gradeSectionProgramId)
    ? gradeSectionProgramId
    : [gradeSectionProgramId];

  const results: StudentResponse = [];

  for (const grade of data) {
    for (const program of grade.programs) {
      if (ids.includes(program.gradeSectionProgramId)) {
        const mappedStudents = program.unassigned.map((student) => ({
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          middleName: student.middleName,
          suffix: student.suffix,
          enrollmentStatus: student.enrollmentStatus,
        }));
        results.push(...mappedStudents);
      }
    }
  }

  return results;
};

// export const getUnasssignedStudentsByGradeId = (
//   gradeId: number,
// ): StudentResponse => {
//   const grade = data.find((item) => item.gradeId === gradeId);
//   if (!grade) return [];

//   return grade.unassigned.map((student) => ({
//     studentId: student.studentId,
//     firstName: student.firstName,
//     lastName: student.lastName,
//     middleName: student.middleName,
//     suffix: student.suffix,
//     enrollmentStatus: student.enrollmentStatus,
//   }));
// };

export const getRequirementsByStudentId = (
  studentId: number,
): RequirementResponse => {
  const grade = data.find((gradeLevel) => {
    // Check if student is in any section or unassigned within any program
    return gradeLevel.programs.some((program) => {
      const inSection = program.sections.some((section) =>
        section.students.some((s) => s.studentId === studentId),
      );
      const inUnassigned = program.unassigned.some(
        (s) => s.studentId === studentId,
      );
      return inSection || inUnassigned;
    });
  });

  if (!grade) return [];

  // Find the program that contains the student, then find the section
  const program = grade.programs.find(
    (program) =>
      program.unassigned.some((s) => s.studentId === studentId) ||
      program.sections.some((section) =>
        section.students.some((s) => s.studentId === studentId),
      ),
  );

  if (!program) return [];

  // Find the section within the program or the unassigned list
  const section =
    program.sections.find((section) =>
      section.students.some((s) => s.studentId === studentId),
    ) || null;

  const student =
    section?.students.find((s) => s.studentId === studentId) ??
    program.unassigned.find((s) => s.studentId === studentId);

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
    // Check if the requirement is in any section or unassigned within any program
    return gradeLevel.programs.some((program) => {
      const inSection = program.sections.some((section) =>
        section.students.some((s) =>
          s.requirements.some((r) => r.applicationId === applicationId),
        ),
      );
      const inUnassigned = program.unassigned.some((s) =>
        s.requirements.some((r) => r.applicationId === applicationId),
      );
      return inSection || inUnassigned;
    });
  });

  if (!grade) throw new Error("Grade level not found");

  // Find the program that contains the requirement
  const program = grade.programs.find(
    (program) =>
      program.sections.some((section) =>
        section.students.some((s) =>
          s.requirements.some((r) => r.applicationId === applicationId),
        ),
      ) ||
      program.unassigned.some((s) =>
        s.requirements.some((r) => r.applicationId === applicationId),
      ),
  );

  if (!program) throw new Error("Program not found");

  // Find the section containing the student
  const section =
    program.sections.find((section) =>
      section.students.some((s) =>
        s.requirements.some((r) => r.applicationId === applicationId),
      ),
    ) || null;

  // Find the student either in the section or unassigned list
  const student =
    section?.students.find((s) =>
      s.requirements.some((r) => r.applicationId === applicationId),
    ) ??
    program.unassigned.find((s) =>
      s.requirements.some((r) => r.applicationId === applicationId),
    );

  if (!student) throw new Error("Student not found");

  // Find the specific requirement
  const requirement = student.requirements.find(
    (r) =>
      r.applicationId === applicationId && r.requirementId === requirementId,
  );

  if (!requirement) {
    throw new Error("Requirement not found");
  }

  // Update requirement status based on the action
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
    grade.programs.some((program) =>
      program.unassigned.some(
        (student) => student.studentId === payload.studentId,
      ),
    ),
  );

  if (gradeIdx === -1) throw new Error("Student not found in unassigned list.");

  const grade = data[gradeIdx];

  // Find the program that contains the unassigned student
  const program = grade.programs.find((program) =>
    program.unassigned.some(
      (student) => student.studentId === payload.studentId,
    ),
  );

  if (!program) throw new Error("Program not found for unassigned student.");

  const studentIdx = program.unassigned.findIndex(
    (student) => student.studentId === payload.studentId,
  );
  const [student] = program.unassigned.splice(studentIdx, 1); // This modifies `program.unassigned`

  student.enrollmentStatus = Enums.application_status.accepted;

  // Find the target section within the program
  const section = program.sections.find(
    (sec) => sec.sectionId === payload.sectionId,
  );

  if (!section) {
    program.unassigned.splice(studentIdx, 0, student); // Restore the student back to unassigned
    throw new Error("Target section not found in the same program.");
  }

  // Add the student to the section
  section.students.push(student);

  return { success: true };
};

export const reassignMockStudentIntoDifferentSection = (
  payload: ReassignBody,
): ReassignResponse => {
  let studentFound = false;

  // Iterate over all grades (Gra)
  for (const grade of data) {
    // Check through the programs within each grade
    for (const program of grade.programs) {
      // Find the section that contains the student
      const section = program.sections.find((sec) =>
        sec.students.some((student) => student.studentId === payload.studentId),
      );

      if (section) {
        const studentIdx = section.students.findIndex(
          (student) => student.studentId === payload.studentId,
        );

        if (studentIdx !== -1) {
          const [student] = section.students.splice(studentIdx, 1);

          // Find the target section within the same program
          const targetSection = program.sections.find(
            (s) => s.sectionId === payload.sectionId,
          );

          if (!targetSection) {
            // Restore the student if the target section isn't found
            section.students.splice(studentIdx, 0, student);
            throw new Error("Target section not found in the same program.");
          }

          // Assign the student to the new section
          targetSection.students.push(student);
          studentFound = true;
          break; // Exit the loop once the student has been reassigned
        }
      }
    }

    if (studentFound) break; // Exit the outer loop as well if student is found and reassigned
  }

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
    // Check within programs and their sections
    for (const program of grade.programs) {
      // Check within sections
      for (const section of program.sections) {
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
      const student = program.unassigned.find((s) => s.studentId === studentId);
      if (student) {
        processStatusChange(student, status);
        studentFound = true;
        return {
          success: true,
        };
      }
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
