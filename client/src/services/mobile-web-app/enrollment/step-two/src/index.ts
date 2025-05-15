import { instance } from "@/lib/axios";
import { PaymentMethodDetailsResponse, RequirementResponse } from "../types";
import {
  getAllMockGradeSectionTypeRequirements,
  getMockPaymentMethodDetails,
} from "./test";

export const getAllGradeSectionTypeRequirements = async (
  gradeSectionProgramId: number,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.get<RequirementResponse>(
      `/api/enrollment/enroll/requirements?grade_level_program_id=${gradeSectionProgramId}`,
    );
  else return { data: getAllMockGradeSectionTypeRequirements() };
};

export const getPaymentMethodDetails = async (
  gradeSectionProgramId: number,
) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.get<PaymentMethodDetailsResponse>(
      `/api/enrollment/enroll/payment?grade_level_program_id=${gradeSectionProgramId}`,
    );
  else return { data: getMockPaymentMethodDetails() };
};
