import { instance } from "@/lib/axios";
import { mockReuploadData } from "./test/sample-data";
import { RequirementsForReuploadResponse } from "../types";

export const getAllRequirementsForReupload = () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<RequirementsForReuploadResponse>(
      `/api/enrollment/re-upload`,
    );
  else return { data: mockReuploadData };
};
export const resubmitInvalidRequirements = async (formData: FormData) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.post(`/api/enrollment/re-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  else return { data: { success: true } };
};
