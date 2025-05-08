import Enums, {
  accepted_data_type,
  requirement_type,
} from "@/services/common/types/enums";
import { sanitizeName } from "@/utils/stringUtils";
import { z } from "zod";

interface Requirement {
  requirementId: number;
  name: string;
  requirementType: requirement_type;
  acceptedDataTypes: accepted_data_type;
  isRequired: boolean;
}

export function generateSchemaFromRequirements(requirements: Requirement[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  requirements.forEach((req) => {
    const fieldName = req.requirementId;
    let schema: z.ZodTypeAny = z.any(); // Default initialization

    // Handle file-based requirements
    if (
      req.acceptedDataTypes === Enums.accepted_data_type.image ||
      req.acceptedDataTypes === Enums.accepted_data_type.document
    ) {
      schema = z
        .instanceof(File)
        .refine((file) => file.size > 0, `${req.name} is required`);
    }

    // Handle string, number, and date types
    else if (req.acceptedDataTypes === Enums.accepted_data_type.string) {
      schema = z.string().min(1, `${req.name} is required`);
    } else if (req.acceptedDataTypes === Enums.accepted_data_type.number) {
      schema = z.preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z
          .number({
            invalid_type_error: `${req.name} must be a number`,
          })
          .refine((n) => !isNaN(n), `${req.name} is required`),
      );
    } else if (req.acceptedDataTypes === Enums.accepted_data_type.date) {
      schema = z.preprocess(
        (val) => (val instanceof Date ? val : new Date(val as string)),
        z.date({
          required_error: `${req.name} is required`,
          invalid_type_error: `${req.name} must be a valid date`,
        }),
      );
    }

    // Optional field wrapping
    if (!req.isRequired) {
      schema = z.union([schema, z.undefined()]);
    }

    shape[fieldName] = schema;
  });

  return z.object(shape);
}
