// For displaying the requirements
export type requirementType = {
    requirementId: number;
    name: string;
    requirementType: 'document' | 'image' | 'text';
    acceptedDataTypes: 'string' | 'number' | 'date' | 'image' | 'document';
    isRequired: boolean | null;
};

// For enrollment schedule
export type processedGradeLevel = {
  gradeLevelOfferedId: number;
  gradeLevelCode: string;
  gradeLevel: string;
  enrollmentSchedule: {
    scheduleId: number;
    applicationSlot: number;
    startDatetime: Date;
    endDatetime: Date;
    isPaused: boolean;
    canChooseSection: boolean;
  }[];
}[];

// Fee types
export type feeTypes = {
  feeType: string;
  feeBreakdown: feeBreakdownType[];
  feeDetails: string;
};

export type feeBreakdownType = {
  feeBreakdown: string;
  feeAmount: number;
}

// Payment method
export type paymentMethod = {
  id: number;
  methodName: string;
  methodType: string;
  accountNumber: number;
  ownerName: string;
}