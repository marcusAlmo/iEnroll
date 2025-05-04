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
  }),
  section: z.string().min(1, {
    message: "Please select a section"
  }),
  enrollmentDate: z
    .preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
      z.date()
    )
    .default(new Date()),
  enrollmentTime: z.number().min(1, {
    message: "Please choose a time"
  })
});
