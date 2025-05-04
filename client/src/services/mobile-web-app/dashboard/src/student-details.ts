import { instance } from "@/lib/axios";

export const getStudentFirstName = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.get<string>(
      "/api/enrollment/dashboard/user/name/first",
    );
  else
    return {
      data: "Juan",
    } as {
      data: string;
    };
};
