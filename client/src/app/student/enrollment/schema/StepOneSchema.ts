import { z } from "zod";

export const stepOneSchema = z.object({
  levelCode: z.string().min(1, {
    message: "Please select a level",
  }),
  gradeLevelCode: z.string().min(1, {
    message: "Please select a grade level",
  }),
  programId: z.string().min(1, {
    message: "Please select a program",
  }),
  sectionId: z.string().optional(),
  enrollmentDate: z
    .preprocess(
      (val) =>
        typeof val === "string" || val instanceof Date ? new Date(val) : val,
      z.date(),
    )
    .default(new Date()),
  scheduleId: z.string().min(1, {
    message: "Please select a schedule",
  }),
});
