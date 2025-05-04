import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z.string().min(1, { message: "Username cannot be empty." }),
    email: z.string().email({ message: "Invalid email format." }),
    contactNumber: z
      .string()
      .min(1, { message: "Contact number is required." })
      .refine((val) => val.startsWith("+639") || val.startsWith("09"), {
        message: "Contact number must start with +639 or 09.",
      })
      .refine(
        (val) => {
          if (val.startsWith("+639")) {
            return val.length >= 13;
          }
          if (val.startsWith("09")) {
            return val.length >= 11;
          }
          return true;
        },
        {
          message: "Contact number is too short.",
        },
      )
      .refine(
        (val) => {
          if (val.startsWith("+639")) {
            return val.length <= 13;
          }
          if (val.startsWith("09")) {
            return val.length <= 11;
          }
          return true;
        },
        {
          message: "Contact number is too long.",
        },
      )
      .refine((val) => /^\+?[0-9]+$/.test(val), {
        message:
          "Contact number must contain only numbers (and optional leading +).",
      }),
      password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .refine((value) => /[A-Za-z]/.test(value) && /[0-9]/.test(value), {
        message: 'Password must contain both letters and numbers.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter.',
      }),    
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(1, "Please enter your first name"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Please enter your last name"),
    suffix: z.string().optional(),
    dateOfBirth: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid date format.",
      })
      .refine((date) => date < new Date(), {
        message: "Date of birth cannot be today or in the future.",
      }),

    sexAssignedAtBirth: z
      .string()
      .min(1, "Please enter your sex assigned at birth"),
    street: z.string().min(1, "Please enter your street"),
    district: z.string().min(1, "Please enter your district"),
    municipality: z.string().min(1, "Please enter your municipality"),
    province: z.string().min(1, "Please enter your province"),
    school: z.string().min(1, "Please select your school"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
