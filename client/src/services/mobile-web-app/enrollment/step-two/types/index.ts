import {
  accepted_data_type,
  requirement_type,
} from "@/services/common/types/enums";

interface Requirement {
  requirementId: number;
  name: string;
  requirementType: requirement_type;
  acceptedDataTypes: accepted_data_type;
  isRequired: boolean | null;
}

export type RequirementResponse = Requirement[];

interface Fee {
  name: string;
  amount: number;
  description: string | null;
  dueDate: Date;
}

interface PaymentOption {
  id: number;
  accountName: string;
  accountNumber: string;
  provider: string;
  instruction: string | null;
}

export type PaymentMethodDetailsResponse = {
  fees: Fee[];
  paymentOptions: PaymentOption[];
};
