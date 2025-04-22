import { instance } from "@/lib/axios";
import { LoginBody, LoginResponse } from "../types/login";

export const login = async (data: LoginBody) => {
  const result = await instance.post<LoginResponse>("/api/auth/login", data);
  return result.data;
};
