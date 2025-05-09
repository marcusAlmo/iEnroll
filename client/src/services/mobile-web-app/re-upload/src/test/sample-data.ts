import Enums from "@/services/common/types/enums";
import { RequirementsForReuploadResponse } from "../../types";

export const mockReuploadData: RequirementsForReuploadResponse = [
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
