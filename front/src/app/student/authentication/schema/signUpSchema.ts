import { z } from 'zod';

export const signUpSchema = z.
  object({
    username: z.string().min(1, "Username must be at least one character"),
    email: z.string().email(),
    contactNumber: z.string().min(1, "Please enter your number"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z.string().min(
      1, "Please enter your first name"
    ),
    middleName: z.string().optional(),
    lastName: z.string().min(1,
      "Please enter your last name"
    ),
    dateOfBirth: z.string().min(1, "Please enter your date of birth"),
    sexAssignedAtBirth: z.string().min(1, 
      "Please enter your sex assigned at birth"
    ),
    street: z.string().min(1, "Please enter your street"),
    district: z.string().min(1, "Please enter your district"),
    municipality: z.string().min(1, "Please enter your municipality"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });