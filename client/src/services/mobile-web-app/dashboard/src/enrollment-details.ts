import { instance } from "@/lib/axios";
import { application_status } from "@/services/common/types/enums";

export const getEnrolleeDetails = async () => {
  return await instance.get<{
    enrollmentId: number;
    schoolId: number;
    schoolName: string;
  }>("/api/enrollment/dashboard/enrollment/details");
  // return {
  //   data: {
  //     enrollmentId: 1,
  //     schoolId: 1,
  //     schoolName: "Bicol University",
  //   },
  // };
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
  // return {
  //   data: {
  //     enrollmentStatus: "accepted",
  //     gradeLevel: "3",
  //     section: "A",
  //     program: "BS Electronics Engineering",
  //     isPaid: true,
  //   },
  // } as {
  //   data: {
  //     enrollmentStatus: application_status;
  //     gradeLevel: string;
  //     section: string | undefined;
  //     program: string | undefined;
  //     isPaid: boolean;
  //     dueDate: Date | undefined;
  //   };
  // };
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
