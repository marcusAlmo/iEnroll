import { instance } from "@/lib/axios";
import { application_status } from "@/services/common/types/enums";

export const getEnrolleeDetails = async () => {
  return await instance.get<{
    enrollmentId: number;
    schoolId: number;
    schoolName: string;
  }>("/api/enrollment/dashboard/enrollment/details");
};

export const getEnrollmentStatus = async () => {
  return await instance.get<{
    enrollmentStatus: application_status;
    gradeLevel: string;
    section: string | undefined;
    program: string | undefined;
    isPaid: boolean;
    dueDate: Date | undefined;
  }>("/api/enrollment/dashboard/enrollment/status");
};

export const getDocumentsForReupload = async () => {
  return await instance.get<
    {
      requirementId: number;
      applicationId: number;
      requirementName: string;
    }[]
  >("/api/enrollment/dashboard/enrollment/documents/re-upload");
};
