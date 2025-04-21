import { z } from "zod";
import { passwordSchema } from "./common/password";

export const signInSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: passwordSchema,
});
