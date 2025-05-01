import { z } from "zod";

export const stepTwoSchema = z.object({
  fatherFN: z.string().min(1, {
    message: "Please enter first name of student's father"
  }),
  fatherMN: z.string().optional(),
  fatherLN: z.string().min(1, {
    message: "Please enter last name of student's father"
  }),
  maidenMotherFN: z.string().min(1, {
    message: "Please enter first name of student's mother"
  }),
  maidenMotherMN: z.string().optional(),
  maidenMotherLN: z.string().min(1, {
    message: "Please enter maiden last name of student's mother"
  }),
  paymentMethodName: z.string().min(1, {
    message: "Please enter a payment method"
  }),
  isAgree: z.literal(true, {
    message: "Please agree to the terms and conditions before submitting"
  }),
  paymentProof: z
    .instanceof(File)
    .nullable() // Allow null (no file selected initially)
    .refine(file => file === null || file.size > 0, {
      message: "File is required",
    }),
});
