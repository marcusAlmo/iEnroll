import { instance } from "@/lib/axios";
// import { EnrollmentApplicationBody } from "./types";

// export const makeStudentApplication = async (
//   payload: EnrollmentApplicationBody,
// ) => {
//   if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
//     return instance.post(`/api/enrollment/enroll`, payload);
//   else return { data: { success: true } };
// };

export const makeStudentApplication = async (formData: FormData) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.post(`/api/enrollment/enroll`, formData, {
      headers: {
         'Content-Type': 'multipart/form-data' 
      },
    });
  else return { data: { success: true } };
};
