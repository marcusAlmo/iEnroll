interface Name {
  firstName: string;
  lastName: string;
  middleName: string | null;
  suffix: string | null;
}

interface Reason {
  requirementName: string;
  reason: string | null;
}

interface DeniedEnrollment {
  applicationId: number;
  student: Name;
  dateDenied: Date | null;
  reviewer: Name | null;
  reasons: Reason[];
}

export type DeniedEnrollmentResponse = DeniedEnrollment[];
