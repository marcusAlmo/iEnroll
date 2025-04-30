import { z } from "zod";

export const stepOneSchema = z.object({
  schoolName: z.string().min(1, {
    message: "Please select a school"
  }),
  level: z.string().min(1, {
    message: "Please select a level"
  }),
  gradeLevel: z.string().min(1, {
    message: "Please select a grade level"
  })
});
