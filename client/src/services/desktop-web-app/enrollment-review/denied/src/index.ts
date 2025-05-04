import { instance } from "@/lib/axios";
import { DeniedEnrollmentResponse } from "../types";
import { transformedDeniedEnrollments } from "./test/sample-data";

export const getDeniedEnrollmentsBySchool = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<DeniedEnrollmentResponse>(
      "/api/enrollment/review/denied",
    );
  else
    return {
      data: transformedDeniedEnrollments,
    };
};
