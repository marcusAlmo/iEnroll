import { instance } from "@/lib/axios";

export const checkIsAuthenticated = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<{ success: boolean }>(`/api/auth/validate`);
  else return { data: { success: true } };
};

export const logout = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.post<{ message: string }>(`/api/auth/logout`);
  else return { data: { message: "Logout successful" } };
};
