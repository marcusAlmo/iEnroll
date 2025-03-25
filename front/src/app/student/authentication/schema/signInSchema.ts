import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(8, "Password must be 8 characters long")
});