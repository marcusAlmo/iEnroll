import { AssignedController } from 'apps/enrollment/src/review/assigned/assigned.controller';

export type GradeLevelsReturn = Awaited<
  ReturnType<AssignedController['getAllGradeLevelsBySchool']>
>;

export type SectionsReturn = Awaited<
  ReturnType<AssignedController['getAllSectionsByGradeLevel']>
>;

export type StudentsAssignedReturn = Awaited<
  ReturnType<AssignedController['getAllStudentsAssigned']>
>;

export type StudentsUnassignedReturn = Awaited<
  ReturnType<AssignedController['getAllStudentsUnassigned']>
>;

export type RequirementsReturn = Awaited<
  ReturnType<AssignedController['getAllRequiermentsByStudent']>
>;

export type ApproveOrDenyAttachmentPayload = Parameters<
  AssignedController['approveOrDenyAttachment']
>[0];

export type ApproveOrDenyAttachmentReturn = Awaited<
  ReturnType<AssignedController['approveOrDenyAttachment']>
>;

export type EnrollStudentPayload = Parameters<
  AssignedController['enrollStudent']
>[0];

export type EnrollStudentReturn = Awaited<
  ReturnType<AssignedController['enrollStudent']>
>;

export type ReassignSectionPayload = Parameters<
  AssignedController['reassignStudentIntoDifferentSection']
>[0];

export type ReassignSectionReturn = Awaited<
  ReturnType<AssignedController['reassignStudentIntoDifferentSection']>
>;
