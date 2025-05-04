import { sanitizeName } from "@/utils/stringUtils";
import { z } from "zod";

export function generateSchemaFromRequirements(requirements: any[]){
  const shape: Record<string, z.ZodTypeAny> = {};

  requirements.forEach((req) => {
    const fieldName = sanitizeName(req.name);
    
    shape[fieldName] = req.isRequired
      ? z
          .instanceof(File)
          .refine((file) => file.size > 0, `${req.name} is required`)
      : z.union([z.instanceof(File), z.undefined()]);
  });

  return z.object(shape);
};
