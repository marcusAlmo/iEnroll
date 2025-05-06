import Enums from "@/services/common/types/enums";
import { PaymentMethodDetailsResponse, RequirementResponse } from "../../types";

export const mockPaymentMethodDetails: PaymentMethodDetailsResponse = {
  fees: [
    {
      name: "Tuition Fee",
      amount: 15000,
      description: "Covers full semester tuition",
      dueDate: new Date("2025-06-15"),
    },
    {
      name: "Registration Fee",
      amount: 1200,
      description: "One-time enrollment registration",
      dueDate: new Date("2025-06-01"),
    },
    {
      name: "Library Fee",
      amount: 500,
      description: null,
      dueDate: new Date("2025-06-10"),
    },
  ],
  paymentOptions: [
    {
      id: 1,
      accountName: "Bicol University",
      accountNumber: "1234-5678-9012",
      provider: "BPI",
      instruction: "Use your student ID as the reference number.",
    },
    {
      id: 2,
      accountName: "Bicol University",
      accountNumber: "09123456789",
      provider: "GCash",
      instruction:
        "Send screenshot to accounting@abcuniv.edu.ph after payment.",
    },
    {
      id: 3,
      accountName: "Bicol University",
      accountNumber: "ACC-2025-0001",
      provider: "PayMaya",
      instruction: null,
    },
  ],
};

export const mockRequirements: RequirementResponse = [
  {
    requirementId: 1,
    name: "Valid Government ID",
    requirementType: Enums.requirement_type.document,
    acceptedDataTypes: Enums.accepted_data_type.document,
    isRequired: true,
  },
  {
    requirementId: 2,
    name: "Profile Picture",
    requirementType: Enums.requirement_type.image,
    acceptedDataTypes: Enums.accepted_data_type.image,
    isRequired: true,
  },
  {
    requirementId: 3,
    name: "Full Name",
    requirementType: Enums.requirement_type.text,
    acceptedDataTypes: Enums.accepted_data_type.string,
    isRequired: true,
  },
  {
    requirementId: 4,
    name: "Birthdate",
    requirementType: Enums.requirement_type.text,
    acceptedDataTypes: Enums.accepted_data_type.date,
    isRequired: true,
  },
  {
    requirementId: 5,
    name: "Income Proof",
    requirementType: Enums.requirement_type.document,
    acceptedDataTypes: Enums.accepted_data_type.document,
    isRequired: false,
  },
  {
    requirementId: 6,
    name: "Contact Number",
    requirementType: Enums.requirement_type.text,
    acceptedDataTypes: Enums.accepted_data_type.string,
    isRequired: false,
  },
  {
    requirementId: 7,
    name: "Number of Dependents",
    requirementType: Enums.requirement_type.text,
    acceptedDataTypes: Enums.accepted_data_type.number,
    isRequired: false,
  },
];
