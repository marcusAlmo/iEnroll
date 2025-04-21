import { z } from "zod";

export const passwordSchema = z
  .string()
  .nonempty("Password is required")
  .min(8, "Must be at least 8 characters long")
  .superRefine((val, ctx) => {
    if (!/[a-z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Include at least one lowercase letter",
      });
      return;
    }

    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Include at least one uppercase letter",
      });
      return;
    }

    if (!/[0-9]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Include at least one number",
      });
      return;
    }
  });
