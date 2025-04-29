import { instance } from "@/lib/axios";

export const getStudentFirstName = async () => {
  return await instance.get<string>("/api/enrollment/dashboard/user/name/first");
};
