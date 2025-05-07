import { z } from "zod";

export const stepOneSchema = z.object({
  level: z.string().min(1, {
    message: "Please select a level",
  }),
  gradeLevel: z.string().min(1, {
    message: "Please select a grade level",
  }),
  program: z.string().min(1, {
    message: "Please select a program",
  }),
  section: z.string().min(1, {
    message: "Please select a section",
  }),
  enrollmentDate: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date(),
    )
    .default(new Date()),
  enrollmentTime: z.number().min(1, {
    message: "Please choose a time",
  }),
});
