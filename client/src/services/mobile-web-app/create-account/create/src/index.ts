import { instance } from "@/lib/axios";
import { CreateAccountBody } from "../types";
import { SchoolReturn } from "@/services/common/school/types";
import { schoolData } from "@/services/common/school/test/sample-data";

export const getAllSchools = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.get<SchoolReturn>(
      "/api/enrollment/create-account/school",
    );
  } else {
    return { data: schoolData };
  }
};

export const createAccount = async (body: CreateAccountBody) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true") {
    return await instance.post("/api/enrollment/create-account", body);
  } else {
    return { data: { mock: true } };
  }
};
